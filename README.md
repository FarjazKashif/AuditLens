# AuditLens

AuditLens is a local security audit and log analysis copilot built for grounded question answering over audit trails, system logs, application logs, incident notes, and defensive playbooks.

The system is designed for questions such as:
- What happened in this timeline?
- Which account triggered suspicious activity?
- Is this pattern closer to brute force, privilege misuse, or a benign operational event?
- What evidence supports escalation?

## What this project does

AuditLens ingests security-related documents, splits them into retrievable chunks, stores them with metadata, and answers questions using retrieval-grounded generation.

## What this project is not

- Not a full SIEM
- Not a production incident response platform
- Not an autonomous containment system
- Not a generic chatbot

## Core design principles

- Evidence first
- No invented timestamps
- No unsupported certainty
- Separate observation from interpretation
- Prefer concise analyst-style answers

## Main artifacts

- `PROJECT_BRIEF.md` for scope
- `PROJECT_CONSTITUTION.md` for non-negotiable rules
- `DOMAIN_CONTEXT.md` for log-analysis knowledge
- `LOG_SCHEMA.md` for data structure
- `INGESTION_RULES.md` for preprocessing
- `QUERY_GUIDE.md` for supported questions
- `RESPONSE_TEMPLATE.md` for output format
- `EVAL_SET.md` for validation questions
- `RUNBOOK.md` for operations
- `.agents/agents/` for agent specs
- `.agents/skills/` for reusable Antigravity skills

## Under-4-hour build goal

The MVP is intentionally small:
1. ingest a few sample logs and documents
2. index them locally
3. answer grounded questions with citations/snippets
4. run a tiny evaluation set
5. keep behavior constrained by a project constitution