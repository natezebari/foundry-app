"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className="font-display font-semibold text-base text-text mb-1">Log in</h1>
      {error && <p className="text-xs text-danger">{error}</p>}
      <div>
        <label className="block font-mono text-[11px] text-muted uppercase tracking-wide mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-amber"
        />
      </div>
      <div>
        <label className="block font-mono text-[11px] text-muted uppercase tracking-wide mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-amber"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full font-mono text-xs font-medium bg-amber text-[#151A0E] px-4 py-2 rounded-md disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
      <p className="text-xs text-muted text-center pt-1">
        No studio yet?{" "}
        <Link href="/signup" className="text-amber hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
