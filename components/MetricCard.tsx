import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

export function MetricCard({ label, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[11px] text-muted uppercase tracking-wide">{label}</span>
        <Icon size={15} className="text-muted" />
      </div>
      <div className="flex items-end justify-between">
        <span className="font-display text-2xl font-bold text-text">{value}</span>
        {trend && (
          <span className={`font-mono text-xs ${trend.positive ? "text-mint" : "text-danger"}`}>
            {trend.positive ? "+" : ""}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
