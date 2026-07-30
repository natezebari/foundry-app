import { createClient } from "./supabase/server";

export interface LatestMetrics {
  ccu: string;
  revenue: string;
  dau: string;
}

// TODO: once auth exists, filter this by the logged-in user's studio_id so
// each studio only sees their own game's metrics. For now it just grabs the
// single most recent row across whatever's in game_metrics.
export async function getLatestMetrics(): Promise<LatestMetrics> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("game_metrics")
    .select("ccu, dau, revenue_robux, date")
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { ccu: "—", revenue: "—", dau: "—" };
  }

  return {
    ccu: data.ccu != null ? data.ccu.toLocaleString() : "—",
    revenue: data.revenue_robux != null ? `R$ ${data.revenue_robux.toLocaleString()}` : "—",
    dau: data.dau != null ? data.dau.toLocaleString() : "—",
  };
}