---
trigger: always_on
---

# Project Context: AuditLens

AuditLens is a local security audit and log analysis copilot. The project is intentionally small and is designed to be built in under 4 hours.

## Purpose
Answer questions about:
- audit logs
- authentication events
- privileged activity
- application and system logs
- incident notes
- policy and playbook documents

## Current repository shape
- root markdown files define scope, rules, schema, query patterns, and evaluation
- `data/` holds sample and raw documents
- `processed/` holds normalized and chunked outputs
- `src/` contains ingest, retrieval, generation, evaluation, and utility code
- `.agents/` contains agent specs, reusable skills, and project context

## Design approach
- ground answers in retrieved evidence
- keep security reasoning explicit and bounded
- prioritize analyst usefulness over open-ended conversation
- keep the first version simple enough to finish quickly

## Key architectural decisions
- use a local knowledge base
- preserve timestamps and provenance
- use a strict response template
- keep a project constitution as a guardrail
- separate ingestion, retrieval, generation, and evaluation

## Important constraints
- no full SIEM scope
- no cloud dependency required for MVP
- no autonomous destructive actions
- no unsupported claims

## Intended next steps
1. populate sample data
2. implement ingestion
3. implement retrieval
4. implement answer formatting
5. run evaluation questions
```

---