"use client";

import { Bell, User } from "lucide-react";

export function TopBar({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-bg/85 backdrop-blur-md z-10">
      <h1 className="font-display font-semibold text-lg text-text">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="text-muted hover:text-text transition-colors">
          <Bell size={18} />
        </button>
        {/* TODO: wire to Supabase auth user + avatar_url once auth ships */}
        <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-muted">
          <User size={15} />
        </div>
      </div>
    </header>
  );
}
