import { useEffect, useState } from "react";
import { ArrowRight, Radar } from "lucide-react";
import { SeverityChip } from "../../components/SeverityChip.jsx";
import { api } from "../../lib/api.js";

const toneClass = {
  cyan: "text-cyanSoft",
  amber: "text-amber",
  danger: "text-danger",
  blue: "text-blue"
};

export function Dashboard({ onOpenIncidents }) {
  const [summary, setSummary] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const response = await api.get("/dashboard/summary");
        if (active) {
          setSummary(response.data);
          setError(null);
        }
      } catch (loadError) {
        if (active) setError(loadError.response?.data?.error?.message || "Unable to load dashboard data");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSummary();
    const interval = setInterval(loadSummary, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const metrics = buildMetrics(summary?.metrics);
  const events = summary?.latestEvents || [];
  const incidents = summary?.activeIncidents || [];

  return (
    <div className="space-y-4">
      <header className="glass-panel rounded p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs uppercase text-cyan">Security correlation platform</p>
            <h2 className="mt-2 text-2xl font-semibold">Live investigation overview</h2>
          </div>
          <button onClick={onOpenIncidents} className="inline-flex h-9 items-center gap-2 rounded border border-cyan/40 px-3 text-sm text-cyanSoft">
            Open queue <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-panel rounded p-4">
            <p className="font-mono text-[10px] uppercase text-muted">{metric.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${toneClass[metric.tone]}`}>{metric.value}</p>
          </div>
        ))}
      </section>

      {loading && <p className="font-mono text-xs uppercase text-muted">Loading live dashboard data...</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded p-4">
          <div className="mb-4 flex items-center gap-2">
            <Radar size={18} className="text-cyan" />
            <h3 className="font-semibold">Latest normalized events</h3>
          </div>
          <div className="space-y-2">
            {events.length === 0 && <EmptyState label="No normalized events yet. Ingest logs to populate this feed." />}
            {events.map((event) => (
              <button
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className="w-full rounded border border-white/10 bg-black/20 p-3 text-left transition hover:border-cyan/40 hover:bg-cyan/5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityChip severity={event.severity} />
                  <span className="font-mono text-xs text-muted">{formatDate(event.timestamp)}</span>
                  <span className="font-mono text-xs text-cyanSoft">{event.eventType}</span>
                </div>
                <p className="mt-2 text-sm">{event.message}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded p-4">
          <h3 className="mb-4 font-semibold">Active incidents</h3>
          <div className="space-y-2">
            {incidents.length === 0 && <EmptyState label="No active incidents. Create one from detections or correlated events." />}
            {incidents.map((incident) => (
              <div key={incident._id} className="rounded border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-muted">{shortId(incident._id)}</span>
                  <SeverityChip severity={incident.severity} />
                </div>
                <p className="mt-2 text-sm font-medium">{incident.title}</p>
                <p className="mt-1 font-mono text-xs uppercase text-muted">
                  {incident.status} / {(incident.detectionIds || []).length} detections
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {selectedEvent && <EventFixModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}

function buildMetrics(metrics = {}) {
  return [
    { label: "Normalized Events", value: formatNumber(metrics.normalizedEvents), tone: "cyan" },
    { label: "Raw Logs", value: formatNumber(metrics.rawLogs), tone: "blue" },
    { label: "Open Incidents", value: formatNumber(metrics.openIncidents), tone: "amber" },
    { label: "Critical Detections", value: formatNumber(metrics.criticalDetections), tone: "danger" },
    { label: "AuditLens Activity", value: formatNumber(metrics.auditLensActivity), tone: "cyan" }
  ];
}

function EmptyState({ label }) {
  return <p className="rounded border border-white/10 bg-black/20 p-3 text-sm text-muted">{label}</p>;
}

function formatNumber(value = 0) {
  return new Intl.NumberFormat().format(value);
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "unknown time";
}

function shortId(value = "") {
  return value.slice(-8).toUpperCase();
}

function EventFixModal({ event, onClose }) {
  const recommendations = getFixRecommendations(event);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="glass-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="font-mono text-xs uppercase text-cyan">Event investigation</p>
            <h3 className="mt-2 text-xl font-semibold">{event.eventType}</h3>
          </div>
          <button onClick={onClose} className="rounded border border-white/10 px-3 py-1 text-sm text-muted hover:border-cyan/40 hover:text-cyanSoft">
            Close
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Info label="Severity" value={event.severity} />
          <Info label="Time" value={formatDate(event.timestamp)} />
          <Info label="Actor" value={event.actor?.user || event.actor?.role || "unknown"} />
          <Info label="Asset" value={event.asset?.hostname || event.asset?.ip || "unknown"} />
          <Info label="Source IP" value={event.source?.ip || "unknown"} />
          <Info label="Outcome" value={event.outcome || "unknown"} />
        </div>

        <div className="border-t border-white/10 p-5">
          <h4 className="font-mono text-xs uppercase text-cyan">Observed evidence</h4>
          <p className="mt-2 rounded border border-white/10 bg-black/30 p-3 text-sm text-muted">{event.message}</p>
        </div>

        <div className="border-t border-white/10 p-5">
          <h4 className="font-mono text-xs uppercase text-cyan">How to fix / investigate</h4>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
            {recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded border border-white/10 bg-black/20 p-3">
      <p className="font-mono text-[10px] uppercase text-muted">{label}</p>
      <p className="mt-1 break-words font-mono text-xs text-cyanSoft">{value}</p>
    </div>
  );
}

function getFixRecommendations(event) {
  const type = String(event.eventType || "").toLowerCase();
  const message = String(event.message || "").toLowerCase();

  if (type.includes("auth.failure") || message.includes("failed login")) {
    return [
      "Check whether the source IP is expected for this account and block it if it is suspicious.",
      "Review recent successful logins for the same user after the failure burst.",
      "Force password reset and verify MFA status if failures are abnormal.",
      "Create or link an incident if failures cluster with privilege, file, or network activity."
    ];
  }

  if (type.includes("auth.success") || message.includes("successful login")) {
    return [
      "Confirm the login location, device, and source IP with the account owner.",
      "Look backward for failed attempts and forward for privilege changes or lateral movement.",
      "Revoke active sessions if the login is not expected.",
      "Rotate credentials if the account is a service account or privileged identity."
    ];
  }

  if (type.includes("privilege") || message.includes("privileged") || message.includes("backup operators")) {
    return [
      "Remove unauthorized group membership immediately.",
      "Review who performed the change and whether the actor should have that permission.",
      "Audit other privileged groups for nearby changes.",
      "Rotate affected account secrets and preserve domain controller logs."
    ];
  }

  if (type.includes("process") || message.includes("powershell") || message.includes("rclone")) {
    return [
      "Isolate the host if the process is unexpected or tied to external transfer.",
      "Collect command line, parent process, hash, and network destination evidence.",
      "Kill the process only after preserving volatile evidence when possible.",
      "Search other hosts for the same process name, command pattern, or file hash."
    ];
  }

  if (type.includes("file") || type.includes("database") || message.includes("csv") || message.includes("finance")) {
    return [
      "Validate whether the actor had a business reason to access this data.",
      "Review file/database audit logs for volume, paths, and exported records.",
      "Check for compression, staging, or outbound transfer after access.",
      "Notify data owners and preserve evidence for impact assessment."
    ];
  }

  if (type.includes("network") || type.includes("proxy") || type.includes("dlp") || message.includes("outbound")) {
    return [
      "Block suspicious destinations while preserving firewall/proxy logs.",
      "Measure bytes transferred and identify the source process or host.",
      "Correlate the transfer with file/database access shortly before the connection.",
      "Escalate as possible exfiltration if sensitive-data indicators are present."
    ];
  }

  return [
    "Validate the actor, asset, timestamp, and source context.",
    "Search for related events around the same user, host, and source IP.",
    "Preserve raw logs before containment changes.",
    "Escalate if this event clusters with authentication, privilege, file, or network anomalies."
  ];
}
