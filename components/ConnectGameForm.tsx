"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ConnectGameForm({ studioId }: { studioId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [universeId, setUniverseId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !universeId.trim()) {
      setError("Enter both a name and a Universe ID.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("games").insert({
      name: name.trim(),
      roblox_universe_id: Number(universeId),
      studio_id: studioId,
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName("");
    setUniverseId("");
    router.refresh(); // re-fetch the Server Component's game list
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-5 space-y-3 max-w-md">
      <h3 className="font-display font-semibold text-sm text-text">Connect a game</h3>
      {error && <p className="text-xs text-danger">{error}</p>}
      <div>
        <label className="block font-mono text-[11px] text-muted uppercase tracking-wide mb-1">
          Game name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="HVSNT Simulator"
          className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-amber"
        />
      </div>
      <div>
        <label className="block font-mono text-[11px] text-muted uppercase tracking-wide mb-1">
          Roblox Universe ID
        </label>
        <input
          value={universeId}
          onChange={(e) => setUniverseId(e.target.value)}
          placeholder="123456789"
          inputMode="numeric"
          className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-amber"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="font-mono text-xs font-medium bg-amber text-[#151A0E] px-4 py-2 rounded-md disabled:opacity-60"
      >
        {loading ? "Connecting..." : "Connect game"}
      </button>
    </form>
  );
}