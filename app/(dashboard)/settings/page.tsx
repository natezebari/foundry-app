import { TopBar } from "@/components/TopBar";

// TODO: split into /settings/billing (Stripe customer portal link) and
// /settings/studio (name, API keys) per the MVP spec's page structure.
export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" />
      <main className="p-6 max-w-lg space-y-4">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display font-semibold text-sm text-text mb-1">Studio name</h2>
          <p className="text-xs text-muted mb-3">Shown in the sidebar and on invites.</p>
          <input
            defaultValue="Nate's Studio"
            className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-amber"
          />
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display font-semibold text-sm text-text mb-1">Billing</h2>
          <p className="text-xs text-muted">Free plan — no card on file.</p>
        </div>
      </main>
    </>
  );
}
