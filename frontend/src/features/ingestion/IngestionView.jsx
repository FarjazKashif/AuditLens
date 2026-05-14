import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { api } from "../../lib/api.js";

const pipeline = ["Receive", "Dedupe", "Normalize", "Correlate", "Detect"];

export function IngestionView() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      try {
        const response = await api.get("/ingest/jobs");
        if (active) {
          setJobs(response.data.jobs || []);
          setError(null);
        }
      } catch (loadError) {
        if (active) setError(loadError.response?.data?.error?.message || "Unable to load ingestion activity");
      }
    }

    loadJobs();
    const interval = setInterval(loadJobs, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="glass-panel rounded p-5">
      <p className="font-mono text-xs uppercase text-cyan">Log ingestion pipeline</p>
      <h2 className="mt-2 text-2xl font-semibold">Audit logs, system logs, and analyst notes</h2>
      <div className="mt-5 rounded border border-dashed border-cyan/40 bg-cyan/5 p-8 text-center">
        <Upload className="mx-auto text-cyan" />
        <p className="mt-3 text-sm text-muted">Live endpoint: POST /api/ingest/events for normalized JSON batches.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {pipeline.map((step, index) => (
          <div key={step} className="rounded border border-white/10 bg-black/20 p-4">
            <p className="font-mono text-xs text-muted">0{index + 1}</p>
            <p className="mt-2 font-semibold">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded border border-white/10 bg-black/20">
        <div className="border-b border-white/10 p-4">
          <h3 className="font-semibold">Recent ingestion activity</h3>
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </div>
        <div className="divide-y divide-white/5">
          {jobs.length === 0 && <p className="p-4 text-sm text-muted">No raw logs have been ingested yet.</p>}
          {jobs.map((job) => (
            <div key={job._id} className="grid gap-2 p-4 text-sm md:grid-cols-[1fr_1fr_160px_120px]">
              <span className="font-mono text-xs text-cyanSoft">{job.sourceType}</span>
              <span className="text-muted">{job.sourceName}</span>
              <span className="font-mono text-xs text-muted">{formatDate(job.receivedAt)}</span>
              <span className="font-mono text-xs uppercase text-cyanSoft">{job.parseStatus}</span>
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
