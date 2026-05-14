# AuditLens

AuditLens is a lightweight MERN-stack security investigation and event correlation platform. It ingests audit logs, system logs, and analyst notes; normalizes them into a shared event schema; correlates related activity; detects deterministic suspicious patterns; reconstructs timelines; and generates analyst-style incident summaries.

This repository started as a static UI prototype collection. The original prototype assets are preserved in `AuditLens/`, including the Cyber-Tactical SOC design system in `AuditLens/cyber_tactical_soc/DESIGN.md`.

## Architecture

- `frontend/`: React + Vite + TailwindCSS analyst console.
- `backend/`: Node.js + Express API with separated investigation services.
- `docs/`: architecture, schema, API, dependency, and roadmap planning artifacts.
- `AuditLens/`: preserved original HTML/screenshots/markdown prototype references.

## MVP Priorities

1. Deterministic ingestion and normalization.
2. Rule-based correlation and detection.
3. Investigation timeline reconstruction.
4. Human-readable incident summaries.
5. Optional AI only for explanation/report drafting after deterministic evidence is computed.

## Local Development

```bash
npm install
npm run dev
```

Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` before connecting to MongoDB.

## AuditLens RAG Service

The AuditLens Python repo is cloned under `services/auditlens/AuditLens`, and the private FastAPI wrapper lives at `services/auditlens/auditlens_api.py`.

Start the Python service:

```bash
cd services/auditlens
python -m pip install -r requirements.txt
python -m uvicorn auditlens_api:app --host 127.0.0.1 --port 8000
```

Start the MERN app from the repository root:

```bash
npm install
npm run dev
```

Required environment values:

- Node `backend/.env`: `AUDITLENS_URL=http://127.0.0.1:8000`
- Python environment: `OPENAI_API_KEY=your_key_here`
