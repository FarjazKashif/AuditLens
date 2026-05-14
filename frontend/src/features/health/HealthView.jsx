import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { api } from "../../lib/api.js";

export function HealthView() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadHealth() {
      try {
        const response = await api.get("/health");
        if (active) {
          setHealth(response.data);
          setError(null);
        }
      } catch (loadError) {
        if (active) setError(loadError.response?.data?.error?.message || "Unable to load system health");
      }
    }

    loadHealth();
    const interval = setInterval(loadHealth, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const services = buildServices(health);

  return (
    <section className="glass-panel rounded p-5">
      <div className="flex items-center gap-2">
        <Activity size={18} className="text-cyan" />
        <p className="font-mono text-xs uppercase text-cyan">System health metrics</p>
      </div>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {services.map(([name, status]) => (
          <div key={name} className="rounded border border-white/10 bg-black/20 p-4">
            <p className="font-semibold">{name}</p>
            <p className="mt-2 font-mono text-xs uppercase text-cyanSoft">{status}</p>
          </div>
        ))}
      </div>
      {health?.timestamp && <p className="mt-4 font-mono text-xs text-muted">Last refresh: {new Date(health.timestamp).toLocaleString()}</p>}
    </section>
  );
}

function buildServices(health) {
  const collections = health?.collections || {};

  return [
    ["API", health?.status || "loading"],
    ["MongoDB", health?.mongo?.connected ? "connected" : "disconnected"],
    ["Events", formatNumber(collections.events)],
    ["Detections", formatNumber(collections.detections)],
    ["AuditLens History", formatNumber(collections.auditLensHistory)]
  ];
}

function formatNumber(value = 0) {
  return new Intl.NumberFormat().format(value);
}
