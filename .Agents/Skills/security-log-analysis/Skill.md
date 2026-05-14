### `.agents/skills/security-log-analysis/SKILL.md`

```md
---
name: security-log-analysis
description: Package security audit, authentication, and incident-analysis knowledge for grounded retrieval and analyst-style questioning.
---

# Security Log Analysis Skill

## Purpose
Provide domain knowledge for security audit and log analysis questions.

## Topics covered
- authentication anomalies
- privilege escalation patterns
- suspicious process chains
- policy violations
- false positives
- incident timelines
- analyst reasoning patterns

## Guidance
- Prefer evidence-rich chunks.
- Preserve timeline integrity.
- Distinguish benign operational activity from suspicious behavior.
- Explain common false positives.
- Support question answering over log and policy documents.

## Output style
- short factual answer
- evidence references
- interpretation
- confidence
- next step
```