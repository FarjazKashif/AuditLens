# Log Schema

The project supports multiple lightweight log formats, but all ingested records should be normalized into this conceptual schema.

## Required fields
- `timestamp`
- `source_file`
- `record_type`
- `host`
- `user`
- `action`
- `severity`
- `event_category`
- `message`

## Optional fields
- `ip_address`
- `process_name`
- `parent_process_name`
- `session_id`
- `event_id`
- `resource`
- `outcome`
- `policy_ref`
- `incident_id`
- `correlation_id`

## Example normalized record
```json
{
  "timestamp": "2026-05-14T09:18:32Z",
  "source_file": "audit-log-01.csv",
  "record_type": "audit",
  "host": "ws-014",
  "user": "jdoe",
  "action": "failed_login",
  "severity": "medium",
  "event_category": "authentication",
  "message": "Failed login for user jdoe from 10.10.8.21",
  "ip_address": "10.10.8.21",
  "session_id": "sess-90331",
  "outcome": "failure"
}