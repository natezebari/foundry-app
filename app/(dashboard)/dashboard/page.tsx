import { TopBar } from "@/components/TopBar";
import { MetricCard } from "@/components/MetricCard";
import { Users, DollarSign, Activity, CheckSquare } from "lucide-react";

// TODO: replace every block below with real Supabase queries once the schema
// from the MVP spec is live:
//   - metrics: select last row per game from `game_metrics`
//   - tasks: select from `tasks` where status != 'done' order by due_date
//   - calendar: select from `calendar_events` where scheduled_date >= today order by scheduled_date limit 3
const MOCK_METRICS = { ccu: "18,204", revenue: "R$ 412,900", dau: "6,412", tasksDue: "6" };
const MOCK_TASKS = [
  { id: 1, title: "Build Halloween map", assignee: "John", status: "in_progress", due: "Fri" },
  { id: 2, title: "Fix trading dupe exploit", assignee: "Priya", status: "todo", due: "Today" },
  { id: 3, title: "Balance pet spin odds", assignee: "Sam", status: "review", due: "Mon" },
];
const MOCK_EVENTS = [
  { id: 1, title: "Halloween Event launch", date: "Oct 24" },
  { id: 2, title: "Black Friday sale", date: "Nov 28" },
];

const STATUS_STYLES: Record<string, string> = {
  todo: "text-muted border-border",
  in_progress: "text-amber border-amber/30",
  review: "text-mint border-mint/30",
};

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Mission Control" />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="CCU" value={MOCK_METRICS.ccu} icon={Activity} trend={{ value: "4.2%", positive: true }} />
          <MetricCard label="Revenue (24h)" value={MOCK_METRICS.revenue} icon={DollarSign} trend={{ value: "1.8%", positive: true }} />
          <MetricCard label="DAU" value={MOCK_METRICS.dau} icon={Users} />
          <MetricCard label="Tasks due today" value={MOCK_METRICS.tasksDue} icon={CheckSquare} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-sm text-text">Open tasks</h2>
              <span className="font-mono text-[11px] text-muted">{MOCK_TASKS.length} active</span>
            </div>
            <div className="space-y-2">
              {MOCK_TASKS.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-text">{task.title}</p>
                    <p className="font-mono text-[11px] text-muted mt-0.5">{task.assignee}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] uppercase tracking-wide border rounded px-2 py-1 ${STATUS_STYLES[task.status]}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    <span className="font-mono text-xs text-muted w-10 text-right">{task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display font-semibold text-sm text-text mb-4">Upcoming</h2>
            <div className="space-y-3">
              {MOCK_EVENTS.map((event) => (
                <div key={event.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-text">{event.title}</span>
                  <span className="font-mono text-[11px] text-muted">{event.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
