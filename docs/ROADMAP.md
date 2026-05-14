# Implementation Roadmap

## Phase 1: MERN Foundation

- Add MongoDB connection and environment configuration.
- Implement raw log and normalized event models.
- Build JSON ingestion endpoint.
- Add dashboard shell and event explorer view.

## Phase 2: Deterministic Investigation Engine

- Implement normalization adapters for audit logs, system logs, and incident notes.
- Add correlation keys and entity extraction.
- Add initial detection rules:
  - failed login burst;
  - successful login after repeated failures;
  - privilege change after suspicious authentication;
  - high-severity event cluster by asset;
  - repeated access denied events.

## Phase 3: Incident Workflow

- Create incidents from detections.
- Build timeline reconstruction endpoint.
- Add incident directory and incident detail UI.
- Support analyst notes linked to events.

## Phase 4: Reporting

- Generate deterministic incident summaries.
- Add report evidence sections and recommended actions.
- Optionally add AI-assisted wording after deterministic evidence selection.

## Development Priorities

1. Shared event schema and indexes.
2. Reliable ingestion with dedupe.
3. Deterministic rule engine.
4. Timeline reconstruction.
5. Analyst workflow UI.
6. Reporting polish and optional AI explanations.
