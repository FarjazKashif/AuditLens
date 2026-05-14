import { Activity, BrainCircuit, Database, FileText, Gauge, GitBranch, ShieldAlert } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "events", label: "Events", icon: Activity },
  { id: "incidents", label: "Incidents", icon: ShieldAlert },
  { id: "auditlens", label: "AuditLens", icon: BrainCircuit },
  { id: "ingestion", label: "Ingestion", icon: Database },
  { id: "health", label: "Health", icon: GitBranch },
  { id: "docs", label: "Docs", icon: FileText }
];

export function Shell({ activeView, onViewChange, children }) {
  return (
    <div className="min-h-screen bg-background text-text grid-pattern">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0e0e10]/95 p-4 lg:block">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan">AuditLens</p>
          <h1 className="mt-2 text-xl font-semibold">Investigation Engine</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex h-10 w-full items-center gap-3 rounded border px-3 text-left text-sm ${
                  active ? "border-cyan/40 bg-cyan/10 text-cyanSoft" : "border-transparent text-muted hover:border-white/10 hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="min-h-screen p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
