"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [studioName, setStudioName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { studio_name: studioName.trim() || "My Studio" } },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.session) {
      // Email confirmation is required before a session exists.
      setError("Check your email to confirm your account, then log in.");
      return;
    }

    router.push("/onboarding/connect-roblox");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className="font-display font-semibold text-base text-text mb-1">Create your studio</h1>
      {error && <p className="text-xs text-danger">{error}</p>}
      <div>
        <label className="block font-mono text-[11px] text-muted uppercase tracking-wide mb-1">
          Studio name
        </label>
        <input
          value={studioName}
          onChange={(e) => setStudioName(e.target.value)}
          placeholder="HVSNT Games"
          className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-amber"
        />
      </div>
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
          minLength={6}
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
        {loading ? "Creating studio..." : "Create studio"}
      </button>
      <p className="text-xs text-muted text-center pt-1">
        Already have a studio?{" "}
        <Link href="/login" className="text-amber hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
