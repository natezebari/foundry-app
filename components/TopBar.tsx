import { Bell, User } from "lucide-react";
import { getUserContext } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function TopBar({ title }: { title: string }) {
  const ctx = await getUserContext();

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-bg/85 backdrop-blur-md z-10">
      <h1 className="font-display font-semibold text-lg text-text">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="text-muted hover:text-text transition-colors">
          <Bell size={18} />
        </button>
        {ctx?.email && (
          <span className="font-mono text-[11px] text-muted hidden sm:inline">{ctx.email}</span>
        )}
        <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-muted overflow-hidden">
          {ctx?.profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ctx.profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={15} />
          )}
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
