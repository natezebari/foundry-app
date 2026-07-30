import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { buildRobloxAuthorizeUrl, isRobloxConfigured } from "@/lib/roblox";

export async function GET(request: NextRequest) {
  if (!isRobloxConfigured()) {
    const url = new URL("/onboarding/connect-roblox", request.url);
    url.searchParams.set("error", "not_configured");
    return NextResponse.redirect(url);
  }

  const state = randomBytes(16).toString("hex");
  const response = NextResponse.redirect(buildRobloxAuthorizeUrl(state));
  response.cookies.set("roblox_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
