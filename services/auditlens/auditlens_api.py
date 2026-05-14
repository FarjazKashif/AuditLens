# Exposes the local AuditLens RAG pipeline through a private FastAPI service.
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

SERVICE_DIR = Path(__file__).resolve().parent
AUDITLENS_REPO = SERVICE_DIR / "AuditLens"
STORAGE_DIR = SERVICE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
INDEX_PATH = STORAGE_DIR / "index.json"
ALLOWED_EXTENSIONS = {".log", ".txt", ".json", ".md", ".csv"}

sys.path.insert(0, str(AUDITLENS_REPO))

try:
    from auditlens_pipeline import answer_question as pipeline_answer_question
    from auditlens_pipeline import ingest_file as pipeline_ingest_file
except ImportError:
    pipeline_answer_question = None
    pipeline_ingest_file = None

app = FastAPI(title="AuditLens RAG API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("EXPRESS_ORIGIN", "http://localhost:5000"),
        "http://127.0.0.1:5000",
    ],
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1)


@app.post("/ingest")
async def ingest(file: UploadFile = File(...)) -> dict[str, Any]:
    extension = Path(file.filename or "").suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    target_path = UPLOAD_DIR / Path(file.filename).name
    content = await file.read()
    target_path.write_bytes(content)

    if pipeline_ingest_file:
      result = pipeline_ingest_file(str(target_path))
      return {
          "status": "indexed",
          "filename": file.filename,
          "chunks": int(result.get("chunks", 0) if isinstance(result, dict) else result),
      }

    text = content.decode("utf-8", errors="replace")
    chunks = chunk_text(text)
    index = load_index()
    index = [entry for entry in index if entry.get("filename") != file.filename]
    index.extend(
        {
            "filename": file.filename,
            "chunk_id": f"{file.filename}:{position + 1}",
            "text": chunk,
        }
        for position, chunk in enumerate(chunks)
    )
    save_index(index)

    return {"status": "indexed", "filename": file.filename, "chunks": len(chunks)}


@app.post("/query")
async def query(payload: QueryRequest) -> dict[str, Any]:
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question must be a non-empty string")

    if pipeline_answer_question:
        result = pipeline_answer_question(question)
        return {
            "answer": result.get("answer", "") if isinstance(result, dict) else str(result),
            "sources": result.get("sources", []) if isinstance(result, dict) else [],
        }

    index = load_index()
    matches = retrieve(question, index)
    if not matches:
        return {
            "answer": "No indexed evidence matched the question. Ingest relevant logs or notes first.",
            "sources": [],
        }

    answer = await generate_grounded_answer(question, matches)
    sources = [f"{match['filename']}#{match['chunk_id'].split(':')[-1]}" for match in matches]
    return {"answer": answer, "sources": sources}


def chunk_text(text: str, max_chars: int = 1200, overlap: int = 150) -> list[str]:
    normalized = re.sub(r"\n{3,}", "\n\n", text.strip())
    if not normalized:
        return []

    chunks = []
    start = 0
    while start < len(normalized):
        end = min(start + max_chars, len(normalized))
        chunks.append(normalized[start:end].strip())
        if end == len(normalized):
            break
        start = max(0, end - overlap)

    return [chunk for chunk in chunks if chunk]


def retrieve(question: str, index: list[dict[str, str]], limit: int = 5) -> list[dict[str, str]]:
    query_terms = set(tokenize(question))
    scored = []

    for entry in index:
        text_terms = set(tokenize(entry.get("text", "")))
        score = len(query_terms & text_terms)
        if score:
            scored.append((score, entry))

    scored.sort(key=lambda item: item[0], reverse=True)
    return [entry for _score, entry in scored[:limit]]


async def generate_grounded_answer(question: str, matches: list[dict[str, str]]) -> str:
    evidence = "\n\n".join(
        f"Source: {match['filename']} chunk {match['chunk_id'].split(':')[-1]}\n{match['text']}"
        for match in matches
    )

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return (
            "Evidence summary:\n"
            + "\n".join(f"- {match['text'][:260].strip()}" for match in matches)
            + "\n\nSet OPENAI_API_KEY to enable GPT-4 analyst-style synthesis."
        )

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4"),
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are AuditLens. Answer only from the supplied evidence. "
                        "If evidence is insufficient, say so. Do not invent timestamps, users, hosts, or certainty."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Question: {question}\n\nEvidence:\n{evidence}",
                },
            ],
            temperature=0.1,
        )
        return response.choices[0].message.content or ""
    except Exception as exc:
        return (
            "Evidence was retrieved, but GPT-4 synthesis failed. "
            f"Error: {exc}\n\nEvidence summary:\n"
            + "\n".join(f"- {match['text'][:260].strip()}" for match in matches)
        )


def tokenize(value: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9_.:-]+", value.lower())


def load_index() -> list[dict[str, str]]:
    if not INDEX_PATH.exists():
        return []
    return json.loads(INDEX_PATH.read_text(encoding="utf-8"))


def save_index(index: list[dict[str, str]]) -> None:
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    INDEX_PATH.write_text(json.dumps(index, indent=2), encoding="utf-8")
