"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gamepad2, Users, Settings, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import type { Studio } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ studio }: { studio: Studio | null }) {
  const pathname = usePathname();
  const studioName = studio?.name ?? "My Studio";
  const planLabel = studio?.subscription_status === "active" ? "active" : "trial";

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-5 border-b border-border">
        <Logo />
      </div>

      <button className="mx-3 mt-4 mb-2 flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2.5 text-left hover:border-muted transition-colors">
        <span className="font-mono text-xs text-text truncate">{studioName}</span>
        <ChevronDown size={14} className="text-muted shrink-0" />
      </button>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-surface-2 text-amber border border-amber/30"
                  : "text-muted hover:text-text hover:bg-surface-2 border border-transparent"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 rounded-md px-2 py-2 font-mono text-[11px] text-muted uppercase tracking-wide">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-mint" />
          {planLabel} plan
        </div>
      </div>
    </aside>
  );
}
