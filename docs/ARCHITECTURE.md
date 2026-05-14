# MERN Architecture Plan

## Repository Analysis

The current repository contains an `AuditLens/` prototype bundle:

- `auditlens_dashboard/`: SOC overview dashboard HTML and screenshot.
- `event_explorer_raw_log_analysis/`: raw event/log explorer HTML and screenshot.
- `incident_investigation_inc_2024_089/`: incident detail and timeline HTML and screenshot.
- `active_incident_directory/`: incident queue/directory HTML and screenshot.
- `log_ingestion_pipeline/`: ingestion pipeline HTML and screenshot.
- `auditlens_system_health_metrics/`: platform health metrics HTML and screenshot.
- `cyber_tactical_soc/DESIGN.md`: reusable design system and markdown documentation.

All original markdown and prototype files are preserved. The new MERN implementation uses them as product and visual references.

## Target Architecture

```text
frontend React/Tailwind
  -> API client
  -> dashboard, events, incidents, ingestion, health features

backend Express
  -> routes/controllers
  -> ingestion service
  -> normalization service
  -> correlation service
  -> detection service
  -> timeline service
  -> reporting service
  -> MongoDB models

MongoDB
  -> raw_logs
  -> events
  -> incidents
  -> detections
  -> investigation_notes
  -> reports
```

## Backend Service Boundaries

- `ingestion`: accepts files, JSON batches, syslog-like lines, and analyst notes.
- `normalization`: maps heterogeneous records into the shared `Event` schema.
- `correlation`: groups related events by actor, asset, source IP, session, process, and time windows.
- `detection`: applies deterministic rules such as failed-login bursts, privilege changes after authentication failures, suspicious process chains, and unusual admin activity.
- `timeline`: orders evidence into investigation timelines with phase labels.
- `reporting`: creates analyst-ready summaries from deterministic findings and timelines.

## Frontend Structure

- `dashboard`: platform and incident overview.
- `events`: searchable normalized event explorer.
- `incidents`: active incident queue and investigation workspace.
- `ingestion`: upload/source status and normalization feedback.
- `health`: service and data pipeline health.

## AI Boundary

AI is not responsible for detection decisions. It may assist only with:

- converting deterministic findings into readable summaries;
- explaining rule matches;
- drafting report language from already selected evidence.
