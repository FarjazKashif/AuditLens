### `.agents/skills/rag-answering/SKILL.md`

```md
---
name: rag-answering
description: Teach the agent to answer questions using retrieved context, evidence separation, and grounded response formatting.
---

# RAG Answering Skill

## Purpose
Improve answer quality for retrieval-grounded questions.

## Guidance
- read the question carefully
- retrieve before answering
- rely on the provided context
- do not speculate beyond evidence
- use the response template

## Required response structure
1. Answer
2. Evidence
3. Interpretation
4. Confidence
5. Recommended next step

## Quality rules
- never fabricate missing fields
- never overstate confidence
- never ignore conflicting evidence
- keep answers concise and analyst-friendly
```

---