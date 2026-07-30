import { TopBar } from "@/components/TopBar";
import { Users } from "lucide-react";

// TODO: list members from `profiles` where studio_id = current studio,
// with an invite flow that creates a pending row + sends an email invite.
export default function TeamPage() {
  return (
    <>
      <TopBar title="Team" />
      <main className="p-6">
        <div className="rounded-lg border border-dashed border-border bg-surface p-10 flex flex-col items-center text-center gap-3">
          <Users size={28} className="text-muted" />
          <p className="text-sm text-text">It's just you so far</p>
          <p className="text-xs text-muted max-w-xs">
            Invite builders, scripters, UI, and animators to assign tasks and share the dashboard.
          </p>
          <button className="mt-2 font-mono text-xs font-medium bg-amber text-[#151A0E] px-4 py-2 rounded-md">
            Invite a teammate
          </button>
        </div>
      </main>
    </>
  );
}
