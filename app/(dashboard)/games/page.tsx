import { TopBar } from "@/components/TopBar";
import { Gamepad2 } from "lucide-react";

// TODO: list games from the `games` table, each linking to
// /games/[gameId]/overview | tasks | calendar | economy (per the MVP spec).
export default function GamesPage() {
  return (
    <>
      <TopBar title="Games" />
      <main className="p-6">
        <div className="rounded-lg border border-dashed border-border bg-surface p-10 flex flex-col items-center text-center gap-3">
          <Gamepad2 size={28} className="text-muted" />
          <p className="text-sm text-text">No games connected yet</p>
          <p className="text-xs text-muted max-w-xs">
            Connect a Roblox universe via Open Cloud to start pulling CCU, revenue, and task data.
          </p>
          <button className="mt-2 font-mono text-xs font-medium bg-amber text-[#151A0E] px-4 py-2 rounded-md">
            Connect a game
          </button>
        </div>
      </main>
    </>
  );
}
