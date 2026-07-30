# FOUNDRY — Dashboard Shell

Next.js 14 (App Router) + Tailwind + Supabase scaffold, matching the design system
from the marketing landing page (dark theme, amber/mint accents, Space Grotesk +
Inter + JetBrains Mono).

## What's built

- Sidebar nav (Dashboard / Games / Team / Settings) with active-route highlighting
- Top bar with page title slot + placeholder notification/account icons
- Mission Control dashboard page: metric cards, open tasks list, upcoming events —
  all on **mock data** for now
- Games / Team / Settings pages as empty-state placeholders
- Supabase client + server helpers (`lib/supabase/client.ts`, `lib/supabase/server.ts`),
  wired up but not yet used anywhere — no auth checks exist yet

## What's NOT built yet (next steps)

- Auth pages (`/login`, `/signup`) and session-based route protection
- Real data — every mock array has a `// TODO` comment showing exactly which
  Supabase table/query replaces it (matches the schema from the MVP spec doc)
- Studio switcher functionality (UI exists, doesn't do anything yet)
- Task board (Kanban), content calendar, and economy simulator pages

## Setup

```bash
npm install
cp .env.local.example .env.local
# fill in your Supabase project URL + anon key
npm run dev
```

Visiting `/` redirects straight to `/dashboard` — there's no auth gate yet, so
anyone can currently see it. That's the very next thing to build.

## Design tokens

Colors, fonts, and the FOUNDRY logomark all live in `tailwind.config.ts` and
`components/Logo.tsx` — reused directly from the landing page so the marketing
site and the app look like the same product.
