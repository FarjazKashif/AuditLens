export function normalizeRecord(record, rawLogId) {
  const timestamp = new Date(record.timestamp || record.time || record.date || Date.now());
  const eventType = inferEventType(record);
  const category = eventType.split(".")[0] || "system";
  const severity = normalizeSeverity(record.severity || record.level, eventType);
  const outcome = inferOutcome(record);

  const actorUser = record.user || record.username || record.account || record.actor;
  const hostname = record.hostname || record.host || record.device || record.asset;
  const sourceIp = record.sourceIp || record.src_ip || record.ip || record.remoteAddress;

  return {
    timestamp,
    eventType,
    category,
    severity,
    actor: { user: actorUser, role: record.role },
    asset: { hostname, ip: record.assetIp },
    source: { ip: sourceIp, application: record.application || record.app },
    target: {
      resource: record.resource,
      account: record.targetAccount,
      process: record.process,
      path: record.path
    },
    action: record.action || eventType,
    outcome,
    message: record.message || record.msg || `${eventType} observed`,
    rawLogId,
    correlationKeys: buildCorrelationKeys({ actorUser, hostname, sourceIp, eventType }),
    metadata: record
  };
}

function inferEventType(record) {
  const text = `${record.eventType || record.type || record.action || record.message || ""}`.toLowerCase();

  if (text.includes("failed") && text.includes("login")) return "auth.failure";
  if (text.includes("success") && text.includes("login")) return "auth.success";
  if (text.includes("privilege") || text.includes("role")) return "identity.privilege_change";
  if (text.includes("process")) return "process.start";
  if (text.includes("denied")) return "access.denied";
  if (record.note || record.sourceType === "incident_note") return "note.analyst";

  return record.eventType || "system.event";
}

function normalizeSeverity(value, eventType) {
  const severity = String(value || "").toLowerCase();
  if (["low", "medium", "high", "critical"].includes(severity)) return severity;
  if (eventType.includes("privilege")) return "high";
  if (eventType === "auth.failure" || eventType === "access.denied") return "medium";
  return "low";
}

function inferOutcome(record) {
  const text = `${record.outcome || record.status || record.message || ""}`.toLowerCase();
  if (text.includes("success") || text.includes("accepted")) return "success";
  if (text.includes("fail") || text.includes("denied") || text.includes("rejected")) return "failure";
  return "unknown";
}

function buildCorrelationKeys({ actorUser, hostname, sourceIp, eventType }) {
  return [actorUser && `user:${actorUser}`, hostname && `host:${hostname}`, sourceIp && `ip:${sourceIp}`, eventType && `type:${eventType}`].filter(Boolean);
}
