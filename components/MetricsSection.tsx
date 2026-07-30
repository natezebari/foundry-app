"use client";

import { useState } from "react";
import { Users, DollarSign, Activity, CheckSquare } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { MetricChartModal } from "./MetricChartModal";

interface MetricsSectionProps {
  metrics: { ccu: string; revenue: string; dau: string; tasksDue: string };
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  const [openMetric, setOpenMetric] = useState<null | "ccu" | "revenue">(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="CCU"
          value={metrics.ccu}
          icon={Activity}
          trend={{ value: "4.2%", positive: true }}
          onClick={() => setOpenMetric("ccu")}
        />
        <MetricCard
          label="Revenue (24h)"
          value={metrics.revenue}
          icon={DollarSign}
          trend={{ value: "1.8%", positive: true }}
          onClick={() => setOpenMetric("revenue")}
        />
        <MetricCard label="DAU" value={metrics.dau} icon={Users} />
        <MetricCard label="Tasks due today" value={metrics.tasksDue} icon={CheckSquare} />
      </div>

      <MetricChartModal
        open={openMetric === "ccu"}
        onClose={() => setOpenMetric(null)}
        metricKey="ccu"
        metricLabel="CCU"
      />
      <MetricChartModal
        open={openMetric === "revenue"}
        onClose={() => setOpenMetric(null)}
        metricKey="revenue"
        metricLabel="Revenue"
      />
    </>
  );
}