# Recommended API Structure

Base path: `/api`

## Health

- `GET /health`: service health and MongoDB connectivity.

## Ingestion

- `POST /ingest/events`: ingest JSON event/log records.
- `POST /ingest/notes`: ingest analyst notes.
- `GET /ingest/jobs`: list recent ingestion activity.

## Events

- `GET /events`: search normalized events by time range, severity, actor, asset, type, and text.
- `GET /events/:id`: fetch one normalized event and raw source context.

## Correlation

- `POST /correlate`: run correlation for a time window or entity.
- `GET /correlations`: list active correlated groups.

## Detections

- `POST /detections/run`: execute deterministic detection rules.
- `GET /detections`: list rule matches.
- `PATCH /detections/:id`: triage or suppress a rule match.

## Incidents

- `GET /incidents`: list active incidents.
- `POST /incidents`: create an incident from detections/events.
- `GET /incidents/:id`: fetch incident detail.
- `PATCH /incidents/:id`: update status, owner, tags, or severity.

## Timeline

- `GET /incidents/:id/timeline`: reconstruct ordered timeline.

## Reports

- `POST /incidents/:id/report`: generate a deterministic analyst summary.
- `GET /incidents/:id/report`: fetch latest report.
