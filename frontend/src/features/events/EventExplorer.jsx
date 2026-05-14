import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SeverityChip } from "../../components/SeverityChip.jsx";
import { api } from "../../lib/api.js";

export function EventExplorer() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadEvents(query);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  async function loadEvents(searchValue = "") {
    setLoading(true);
    try {
      const response = await api.get("/events", {
        params: searchValue ? { q: searchValue } : {}
      });
      setEvents(response.data);
      setError(null);
    } catch (loadError) {
      setError(loadError.response?.data?.error?.message || "Unable to load events");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-panel rounded">
      <div className="border-b border-white/10 p-4">
        <p className="font-mono text-xs uppercase text-cyan">Event explorer</p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <label className="flex h-10 flex-1 items-center gap-2 rounded border border-white/10 bg-black/30 px-3">
            <Search size={16} className="text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent font-mono text-sm outline-none"
              placeholder="Search actor, asset, message, event type"
            />
          </label>
          <button onClick={() => loadEvents(query)} className="h-10 rounded border border-cyan/40 px-4 font-mono text-xs uppercase text-cyanSoft">
            Refresh
          </button>
        </div>
        {loading && <p className="mt-3 font-mono text-xs uppercase text-muted">Loading events...</p>}
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/10 font-mono text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Type</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Asset</th>
              <th className="p-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td className="p-4 text-sm text-muted" colSpan="6">No events found. Ingest normalized events to populate this table.</td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 font-mono text-xs text-muted">{formatDate(event.timestamp)}</td>
                <td className="p-3"><SeverityChip severity={event.severity} /></td>
                <td className="p-3 font-mono text-xs text-cyanSoft">{event.eventType}</td>
                <td className="p-3 font-mono text-xs">{event.actor?.user || "unknown"}</td>
                <td className="p-3 font-mono text-xs">{event.asset?.hostname || event.asset?.ip || "unknown"}</td>
                <td className="p-3 text-muted">{event.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "unknown time";
}
