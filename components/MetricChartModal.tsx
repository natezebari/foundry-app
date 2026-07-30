"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type RangeKey = "24h" | "1w" | "1m" | "1y" | "all";
const RANGES: { key: RangeKey; label: string }[] = [
  { key: "24h", label: "24H" },
  { key: "1w", label: "1W" },
  { key: "1m", label: "1M" },
  { key: "1y", label: "1Y" },
  { key: "all", label: "All" },
];

interface MetricChartModalProps {
  open: boolean;
  onClose: () => void;
  metricKey: "ccu" | "revenue";
  metricLabel: string;
}

function generateMockSeries(range: RangeKey, metricKey: "ccu" | "revenue") {
  const pointCounts: Record<RangeKey, number> = { "24h": 24, "1w": 7, "1m": 30, "1y": 12, all: 24 };
  const labelFormats: Record<RangeKey, (i: number) => string> = {
    "24h": (i) => `${i}:00`,
    "1w": (i) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
    "1m": (i) => `Day ${i + 1}`,
    "1y": (i) => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12],
    all: (i) => `M${i + 1}`,
  };

  const base = metricKey === "ccu" ? 17000 : 380000;
  const count = pointCounts[range];
  let value = base;

  return Array.from({ length: count }, (_, i) => {
    value = Math.max(0, value + (Math.random() - 0.45) * base * 0.08);
    return { label: labelFormats[range](i), value: Math.round(value) };
  });
}

export function MetricChartModal({ open, onClose, metricKey, metricLabel }: MetricChartModalProps) {
  const [range, setRange] = useState<RangeKey>("1w");
  const data = useMemo(() => generateMockSeries(range, metricKey), [range, metricKey]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-xl border border-border bg-surface p-6 shadow-[6px_6px_0_#52E3B0]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-lg font-bold text-text">{metricLabel}</h3>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-muted mb-5">Mock data — wire to game_metrics once Supabase is live.</p>

        <div className="flex gap-1.5 mb-5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors ${
                range === r.key
                  ? "bg-amber text-[#151A0E] border-amber font-medium"
                  : "border-border text-muted hover:text-text hover:border-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#2A3341" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#8D97A9"
                fontSize={11}
                fontFamily="var(--font-jetbrains-mono)"
                tickLine={false}
                axisLine={{ stroke: "#2A3341" }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#8D97A9"
                fontSize={11}
                fontFamily="var(--font-jetbrains-mono)"
                tickLine={false}
                axisLine={false}
                width={metricKey === "revenue" ? 56 : 40}
                tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
              />
              <Tooltip
                contentStyle={{
                  background: "#1C232D",
                  border: "1px solid #2A3341",
                  borderRadius: 6,
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#8D97A9" }}
                itemStyle={{ color: "#52E3B0" }}
              />
              <Line type="monotone" dataKey="value" stroke="#FFB338" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}