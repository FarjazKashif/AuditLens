# Reusable Project Documentation

The repository already contains valuable product documentation and visual source material:

- `AuditLens/cyber_tactical_soc/DESIGN.md`: preserve as the canonical visual design reference.
- `AuditLens/auditlens_dashboard/code.html`: dashboard layout and status cards.
- `AuditLens/event_explorer_raw_log_analysis/code.html`: event explorer layout and raw log analysis patterns.
- `AuditLens/incident_investigation_inc_2024_089/code.html`: investigation workspace and timeline reference.
- `AuditLens/active_incident_directory/code.html`: incident queue reference.
- `AuditLens/log_ingestion_pipeline/code.html`: ingestion pipeline reference.
- `AuditLens/auditlens_system_health_metrics/code.html`: service health reference.

The screenshots in those folders are useful acceptance references for rebuilding the UI in React/Tailwind. The HTML files should be treated as prototypes, not runtime source, because they depend on CDN scripts and duplicated inline configuration.
