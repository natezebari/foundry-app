import { createClient } from "./supabase/server";

export interface LatestMetrics {
  ccu: string;
  revenue: string;
  dau: string;
}

// Scoped to the studio's own games via the games.studio_id relation.
export async function getLatestMetrics(studioId: string): Promise<LatestMetrics> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("game_metrics")
    .select("ccu, dau, revenue_robux, date, games!inner(studio_id)")
    .eq("games.studio_id", studioId)
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