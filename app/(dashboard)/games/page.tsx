import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ConnectGameForm } from "@/components/ConnectGameForm";
import { createClient } from "@/lib/supabase/server";
import { getUserContext } from "@/lib/auth";
import { Gamepad2 } from "lucide-react";

export default async function GamesPage() {
  const ctx = await getUserContext();
  if (!ctx?.studio) redirect("/login");

  const supabase = createClient();
  const { data: games } = await supabase
    .from("games")
    .select("id, name, roblox_universe_id")
    .eq("studio_id", ctx.studio.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <TopBar title="Games" />
      <main className="p-6 space-y-6">
        {games && games.length > 0 ? (
          <div className="space-y-2 max-w-md">
            {games.map((game) => (
              <div
                key={game.id}
                className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Gamepad2 size={16} className="text-muted" />
                  <span className="text-sm text-text">{game.name}</span>
                </div>
                <span className="font-mono text-[11px] text-muted">
                  Universe ID: {game.roblox_universe_id ?? "—"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface p-10 flex flex-col items-center text-center gap-3 max-w-md">
            <Gamepad2 size={28} className="text-muted" />
            <p className="text-sm text-text">No games connected yet</p>
            <p className="text-xs text-muted max-w-xs">
              Connect a Roblox universe to start pulling CCU, revenue, and task data.
            </p>
          </div>
        )}

        <ConnectGameForm studioId={ctx.studio.id} />
      </main>
    </>
  );
}