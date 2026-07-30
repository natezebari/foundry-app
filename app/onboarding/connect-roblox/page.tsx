import { redirect } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { getUserContext } from "@/lib/auth";

const ERROR_MESSAGES: Record<string, string> = {
  not_configured:
    "Roblox sign-in isn't configured yet. The studio owner needs to add ROBLOX_CLIENT_ID / ROBLOX_CLIENT_SECRET / ROBLOX_REDIRECT_URI.",
  invalid_state: "That connection attempt expired or was invalid — try again.",
};

export default async function ConnectRobloxPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const ctx = await getUserContext();
  if (!ctx) redirect("/login");
  if (ctx.profile?.roblox_user_id) redirect("/onboarding/billing");

  const error = searchParams?.error;
  const errorMessage = error ? ERROR_MESSAGES[error] ?? error : null;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 text-center space-y-4">
        <Gamepad2 size={28} className="text-muted mx-auto" />
        <h1 className="font-display font-semibold text-base text-text">Connect your Roblox account</h1>
        <p className="text-xs text-muted">
          FOUNDRY links to your Roblox account so we can pull CCU, revenue, and task data for your
          games.
        </p>
        {errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
        <a
          href="/auth/roblox/start"
          className="block font-mono text-xs font-medium bg-amber text-[#151A0E] px-4 py-2 rounded-md"
        >
          Connect Roblox account
        </a>
      </div>
    </div>
  );
}
