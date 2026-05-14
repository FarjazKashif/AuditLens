# INGESTION_RULES.md

```md
# Ingestion Rules

## Accepted inputs
- `.csv`
- `.txt`
- `.md`
- `.json` if normalized easily

## Cleaning rules
- remove obvious duplicate whitespace
- preserve timestamps and identifiers
- keep line order for log files
- do not rewrite security-relevant wording
- do not summarize before indexing

## Chunking rules
### For logs
- chunk by logical event groups or short time windows
- keep related lines together
- preserve chronology

### For markdown documents
- chunk by section headings
- keep policy definitions intact
- keep playbook steps intact

### For incident notes
- chunk by timeline segments, findings, and recommendations

## Metadata to attach
- source file name
- document type
- host if known
- user if known
- timestamp range
- event category
- severity
- any incident or policy reference

## Quality checks
- every chunk must retain provenance
- every chunk must be traceable back to its source
- avoid chunks that are too large to be precise
- avoid chunks that are so small they lose meaning

## Output of ingestion
The ingestion step should produce:
- normalized records
- chunked text files or JSONL
- a manifest of sources processed
- a ready-to-index set of embeddings or vector records