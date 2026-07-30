"use client";

import { useState } from "react";

export function StartTrialButton({ priceId, planLabel }: { priceId: string; planLabel: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/billing/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const body = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(body.error ?? "Something went wrong starting your trial.");
      return;
    }

    window.location.href = body.url;
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-danger">{error}</p>}
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full font-mono text-xs font-medium bg-amber text-[#151A0E] px-4 py-2 rounded-md disabled:opacity-60"
      >
        {loading ? "Redirecting to checkout..." : `Start ${planLabel} trial`}
      </button>
    </div>
  );
}
