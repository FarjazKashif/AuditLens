# RUNBOOK.md

```md
# Runbook

## Start-up sequence
1. Place new raw files into `data/raw/`
2. Run ingestion
3. Confirm normalized records were produced
4. Confirm chunking and metadata are correct
5. Build or refresh the index
6. Query the assistant
7. Run the evaluation set

## Ingestion checklist
- input file type recognized
- timestamps preserved
- metadata extracted
- chunks traceable back to source
- duplicates handled

## Query checklist
- question understood
- relevant evidence retrieved
- answer grounded in source text
- confidence level included
- no unsupported claims

## Maintenance checklist
- update `DOMAIN_CONTEXT.md` when the domain model changes
- update `LOG_SCHEMA.md` when fields change
- update `EVAL_SET.md` when new log patterns are added
- keep `PROJECT_CONSTITUTION.md` strict

## Failure handling
If the assistant gives weak answers:
- inspect chunk size
- inspect retrieval quality
- inspect source formatting
- add better sample logs
- tighten the response template
```

---