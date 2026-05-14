// Parses uploaded AuditLens log text into records for the normalized event pipeline.
export function parseAuditLensLogBuffer(buffer, sourceName) {
  return buffer
    .toString("utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => parseLogLine(line, sourceName))
    .filter(Boolean);
}

function parseLogLine(line, sourceName) {
  const [timestamp, eventType, ...rest] = splitLogPrefix(line);
  if (!timestamp || !eventType) return null;

  const fields = parseKeyValueFields(rest.join(" "));
  const message = fields.message || line;

  return {
    timestamp,
    eventType,
    type: eventType,
    sourceName,
    severity: fields.severity || inferSeverity(eventType, message),
    user: fields.user || fields.actor || fields.analyst,
    actor: fields.actor,
    host: fields.host || fields.device || fields.source_host || fields.db_host,
    hostname: fields.host || fields.device || fields.source_host || fields.db_host,
    sourceIp: fields.source_ip,
    assetIp: fields.destination_ip,
    target: fields.target,
    targetAccount: fields.member,
    process: fields.process,
    path: fields.path || fields.output,
    action: fields.action || eventType,
    outcome: inferOutcome(eventType, message),
    message,
    metadata: fields,
    rawLine: line
  };
}

function splitLogPrefix(line) {
  const match = line.match(/^(\S+)\s+(\S+)\s*(.*)$/);
  return match ? [match[1], match[2], match[3]] : [];
}

function parseKeyValueFields(value) {
  const fields = {};
  const pattern = /(\w+)=("([^"]*)"|[^\s]+)/g;
  let match = pattern.exec(value);

  while (match) {
    fields[match[1]] = match[3] ?? match[2];
    match = pattern.exec(value);
  }

  return fields;
}

function inferSeverity(eventType, message) {
  const text = `${eventType} ${message}`.toLowerCase();
  if (text.includes("critical") || text.includes("dlp") || text.includes("rclone") || text.includes("egress")) return "critical";
  if (text.includes("privilege") || text.includes("encoded") || text.includes("edr") || text.includes("policy.change")) return "high";
  if (text.includes("failure") || text.includes("denied") || text.includes("unusual")) return "medium";
  return "low";
}

function inferOutcome(eventType, message) {
  const text = `${eventType} ${message}`.toLowerCase();
  if (text.includes("success") || text.includes("completed")) return "success";
  if (text.includes("failure") || text.includes("denied") || text.includes("failed")) return "failure";
  return "unknown";
}
