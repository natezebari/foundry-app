import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client that bypasses RLS. Only for server-only contexts with
// no user session to authenticate as (e.g. the Stripe webhook). Never import
// this from a client component or anything that ships to the browser.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY isn't set — admin Supabase client isn't available.");
  }
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
