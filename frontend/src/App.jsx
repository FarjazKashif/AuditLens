import { useState } from "react";
import { Shell } from "./components/Shell.jsx";
import { AuditLensView } from "./features/auditlens/AuditLensView.jsx";
import { Dashboard } from "./features/dashboard/Dashboard.jsx";
import { EventExplorer } from "./features/events/EventExplorer.jsx";
import { HealthView } from "./features/health/HealthView.jsx";
import { IncidentWorkspace } from "./features/incidents/IncidentWorkspace.jsx";
import { IngestionView } from "./features/ingestion/IngestionView.jsx";

export function App() {
  const [activeView, setActiveView] = useState("dashboard");

  const views = {
    dashboard: <Dashboard onOpenIncidents={() => setActiveView("incidents")} />,
    events: <EventExplorer />,
    incidents: <IncidentWorkspace />,
    auditlens: <AuditLensView />,
    ingestion: <IngestionView />,
    health: <HealthView />,
    docs: <DocsView />
  };

  return (
    <Shell activeView={activeView} onViewChange={setActiveView}>
      {views[activeView]}
    </Shell>
  );
}

function DocsView() {
  return (
    <section className="glass-panel rounded p-5">
      <p className="font-mono text-xs uppercase text-cyan">Documentation</p>
      <h2 className="mt-2 text-2xl font-semibold">Reusable AuditLens knowledge</h2>
      <p className="mt-3 max-w-3xl text-sm text-muted">
        Architecture, schemas, API structure, dependencies, and roadmap live in the repository `docs/` folder.
        Original prototype documentation remains preserved in `AuditLens/cyber_tactical_soc/DESIGN.md`.
      </p>
    </section>
  );
}
