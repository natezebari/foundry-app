import { createClient } from "./supabase/server";

export interface Profile {
  id: string;
  studio_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  roblox_user_id: string | null;
  roblox_username: string | null;
  role: "owner" | "member";
}

export interface Studio {
  id: string;
  name: string;
  subscription_status: "trialing" | "active" | "past_due" | "canceled";
  trial_ends_at: string | null;
}

export interface UserContext {
  userId: string;
  email: string | null;
  profile: Profile | null;
  studio: Studio | null;
}

// Fetches the logged-in user's profile + studio in one place so gating logic
// (dashboard layout) and display logic (Sidebar, TopBar) don't each re-derive
// it differently. Returns null if there's no session.
export async function getUserContext(): Promise<UserContext | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, studio_id, full_name, avatar_url, roblox_user_id, roblox_username, role")
    .eq("id", user.id)
    .maybeSingle();

  let studio: Studio | null = null;
  if (profile?.studio_id) {
    const { data } = await supabase
      .from("studios")
      .select("id, name, subscription_status, trial_ends_at")
      .eq("id", profile.studio_id)
      .maybeSingle();
    studio = data;
  }

  return { userId: user.id, email: user.email ?? null, profile, studio };
}
