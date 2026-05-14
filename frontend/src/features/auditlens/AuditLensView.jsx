// Composes the AuditLens upload and query panels inside the dashboard layout.
import { useEffect, useState } from "react";
import { LogUpload } from "../../components/AuditLens/LogUpload.jsx";
import { QueryPanel } from "../../components/AuditLens/QueryPanel.jsx";
import { api } from "../../lib/api.js";

export function AuditLensView() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const response = await api.get("/auditlens/history", { params: { limit: 10 } });
        if (active) {
          setHistory(response.data.history || []);
          setError(null);
        }
      } catch (loadError) {
        if (active) setError(loadError.response?.data?.error?.message || "Unable to load AuditLens history");
      }
    }

    loadHistory();
    const interval = setInterval(loadHistory, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="glass-panel rounded p-5">
      <div className="border-b border-white/10 pb-4">
        <p className="font-mono text-xs uppercase text-cyan">AuditLens RAG</p>
        <h2 className="mt-2 text-2xl font-semibold">Evidence-grounded security analysis</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Upload logs or incident notes, then ask analyst-style questions. The dashboard talks only to Express;
          Express proxies requests to the private FastAPI service on localhost.
        </p>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[380px_1fr]">
        <LogUpload />
        <QueryPanel />
      </div>
      <div className="mt-5 rounded border border-white/10 bg-black/20">
        <div className="border-b border-white/10 p-4">
          <h3 className="font-semibold">Recent AuditLens activity</h3>
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </div>
        <div className="divide-y divide-white/5">
          {history.length === 0 && <p className="p-4 text-sm text-muted">No AuditLens requests have been recorded yet.</p>}
          {history.map((item) => (
            <div key={item._id} className="grid gap-2 p-4 text-sm md:grid-cols-[110px_1fr_180px]">
              <span className="font-mono text-xs uppercase text-cyanSoft">{item.type}</span>
              <span className="text-muted">{item.input}</span>
              <span className="font-mono text-xs text-muted">{formatDate(item.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "unknown time";
}
