import { useEffect, useState } from "react";
import { FileText, GitBranch } from "lucide-react";
import { SeverityChip } from "../../components/SeverityChip.jsx";
import { api } from "../../lib/api.js";

export function IncidentWorkspace() {
  const [incidents, setIncidents] = useState([]);
  const [activeIncidentId, setActiveIncidentId] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const response = await api.get("/incidents");
        setIncidents(response.data);
        setActiveIncidentId((current) => current || response.data[0]?._id || null);
        setError(null);
      } catch (loadError) {
        setError(loadError.response?.data?.error?.message || "Unable to load incidents");
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  useEffect(() => {
    async function loadTimeline() {
      if (!activeIncidentId) {
        setTimeline([]);
        return;
      }

      try {
        const response = await api.get(`/incidents/${activeIncidentId}/timeline`);
        setTimeline(response.data.timeline || []);
      } catch (loadError) {
        setError(loadError.response?.data?.error?.message || "Unable to load incident timeline");
      }
    }

    loadTimeline();
  }, [activeIncidentId]);

  const active = incidents.find((incident) => incident._id === activeIncidentId);

  if (loading) {
    return <p className="font-mono text-xs uppercase text-muted">Loading incidents...</p>;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <section className="glass-panel rounded p-4">
        <p className="font-mono text-xs uppercase text-cyan">Active incident directory</p>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <div className="mt-4 space-y-2">
          {incidents.length === 0 && <p className="rounded border border-white/10 bg-black/20 p-3 text-sm text-muted">No incidents yet.</p>}
          {incidents.map((incident) => (
            <button
              key={incident._id}
              onClick={() => setActiveIncidentId(incident._id)}
              className={`w-full rounded border p-3 text-left ${incident._id === activeIncidentId ? "border-cyan/40 bg-cyan/10" : "border-white/10 bg-black/20"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted">{shortId(incident._id)}</span>
                <SeverityChip severity={incident.severity} />
              </div>
              <p className="mt-2 text-sm font-medium">{incident.title}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded">
        {!active && <p className="p-5 text-sm text-muted">Select or create an incident to view its timeline.</p>}
        {active && (
          <>
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase text-cyan">{shortId(active._id)}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{active.title}</h2>
                </div>
                <SeverityChip severity={active.severity} />
              </div>
            </div>

            <div className="grid gap-4 p-5 xl:grid-cols-[1fr_320px]">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <GitBranch size={18} className="text-cyan" />
                  <h3 className="font-semibold">Investigation timeline</h3>
                </div>
                <div className="space-y-3">
                  {timeline.length === 0 && <p className="rounded border border-white/10 bg-black/20 p-3 text-sm text-muted">No timeline evidence linked yet.</p>}
                  {timeline.map((item) => (
                    <div key={`${item.timestamp}-${item.evidenceId}`} className="border-l border-cyan/40 pl-4">
                      <p className="font-mono text-xs text-muted">{formatDate(item.timestamp)}</p>
                      <p className="mt-1 text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded border border-white/10 bg-black/20 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-cyan" />
                  <h3 className="font-semibold">Analyst summary</h3>
                </div>
                <p className="text-sm text-muted">{active.summary || "No incident report has been generated yet."}</p>
              </aside>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function shortId(value = "") {
  return value.slice(-8).toUpperCase();
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "unknown time";
}
