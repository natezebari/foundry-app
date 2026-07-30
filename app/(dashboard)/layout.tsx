import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { getUserContext } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getUserContext();

  if (!ctx) redirect("/login");
  if (!ctx.profile?.roblox_user_id) redirect("/onboarding/connect-roblox");
  if (!ctx.studio || !["trialing", "active"].includes(ctx.studio.subscription_status)) {
    redirect("/onboarding/billing");
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar studio={ctx.studio} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
