# MongoDB Schema Recommendations

## RawLog

Stores original source records without destructive transformation.

- `sourceType`: `audit`, `system`, `incident_note`, `edr`, `cloud`, `identity`
- `sourceName`: collector or uploaded file name
- `receivedAt`: ingestion timestamp
- `raw`: original object or line
- `hash`: dedupe hash
- `parseStatus`: `pending`, `parsed`, `failed`
- `errors`: parser errors

Indexes: `{ hash: 1 } unique`, `{ receivedAt: -1 }`, `{ sourceType: 1, receivedAt: -1 }`

## Event

Shared normalized event schema.

- `timestamp`: event time
- `eventType`: normalized type, for example `auth.failure`, `auth.success`, `process.start`
- `category`: `authentication`, `process`, `network`, `file`, `identity`, `note`
- `severity`: `low`, `medium`, `high`, `critical`
- `actor`: `{ user, userId, role }`
- `asset`: `{ hostname, ip, id, type }`
- `source`: `{ ip, port, geo, application }`
- `target`: `{ resource, account, process, path }`
- `action`: normalized action verb
- `outcome`: `success`, `failure`, `unknown`
- `message`: human-readable summary
- `rawLogId`: reference to `RawLog`
- `correlationKeys`: stable keys used by correlation rules
- `metadata`: source-specific fields

Indexes: `{ timestamp: -1 }`, `{ eventType: 1, timestamp: -1 }`, `{ "actor.user": 1, timestamp: -1 }`, `{ "asset.hostname": 1, timestamp: -1 }`, `{ correlationKeys: 1 }`

## Detection

Stores deterministic rule matches.

- `ruleId`
- `ruleName`
- `severity`
- `confidence`
- `matchedAt`
- `window`: `{ start, end }`
- `eventIds`
- `entities`: actors, assets, IPs, resources
- `reason`
- `status`: `new`, `triaged`, `suppressed`, `linked`

Indexes: `{ matchedAt: -1 }`, `{ ruleId: 1, matchedAt: -1 }`, `{ status: 1, severity: 1 }`

## Incident

Investigation container.

- `title`
- `status`: `open`, `investigating`, `contained`, `closed`
- `severity`
- `createdAt`
- `updatedAt`
- `detectionIds`
- `eventIds`
- `entities`
- `timeline`
- `summary`
- `owner`
- `tags`

Indexes: `{ status: 1, updatedAt: -1 }`, `{ severity: 1, updatedAt: -1 }`, `{ tags: 1 }`

## InvestigationNote

Analyst-authored context.

- `incidentId`
- `author`
- `createdAt`
- `body`
- `linkedEventIds`
- `tags`

Indexes: `{ incidentId: 1, createdAt: 1 }`

## Report

Generated or analyst-approved incident output.

- `incidentId`
- `generatedAt`
- `summary`
- `timeline`
- `keyFindings`
- `recommendedActions`
- `evidence`
- `generatedBy`: `deterministic` or `ai_assisted`
