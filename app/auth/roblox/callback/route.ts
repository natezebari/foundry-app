import { NextRequest, NextResponse } from "next/server";
import { exchangeRobloxCode } from "@/lib/roblox";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get("roblox_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    const url = new URL("/onboarding/connect-roblox", request.url);
    url.searchParams.set("error", "invalid_state");
    return NextResponse.redirect(url);
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { robloxUserId, robloxUsername } = await exchangeRobloxCode(code);
    const { error } = await supabase
      .from("profiles")
      .update({
        roblox_user_id: robloxUserId,
        roblox_username: robloxUsername,
        roblox_connected_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      const url = new URL("/onboarding/connect-roblox", request.url);
      url.searchParams.set("error", error.message);
      return NextResponse.redirect(url);
    }
  } catch (err) {
    const url = new URL("/onboarding/connect-roblox", request.url);
    url.searchParams.set("error", err instanceof Error ? err.message : "unknown_error");
    return NextResponse.redirect(url);
  }

  const response = NextResponse.redirect(new URL("/onboarding/billing", request.url));
  response.cookies.delete("roblox_oauth_state");
  return response;
}
