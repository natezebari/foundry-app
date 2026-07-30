const ROBLOX_AUTHORIZE_URL = "https://apis.roblox.com/oauth/v1/authorize";
const ROBLOX_TOKEN_URL = "https://apis.roblox.com/oauth/v1/token";
const ROBLOX_USERINFO_URL = "https://apis.roblox.com/oauth/v1/userinfo";

export class RobloxNotConfiguredError extends Error {
  constructor() {
    super(
      "Roblox OAuth isn't configured yet — set ROBLOX_CLIENT_ID, ROBLOX_CLIENT_SECRET, and ROBLOX_REDIRECT_URI."
    );
    this.name = "RobloxNotConfiguredError";
  }
}

export function isRobloxConfigured() {
  return Boolean(
    process.env.ROBLOX_CLIENT_ID && process.env.ROBLOX_CLIENT_SECRET && process.env.ROBLOX_REDIRECT_URI
  );
}

function getConfig() {
  const clientId = process.env.ROBLOX_CLIENT_ID;
  const clientSecret = process.env.ROBLOX_CLIENT_SECRET;
  const redirectUri = process.env.ROBLOX_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) throw new RobloxNotConfiguredError();
  return { clientId, clientSecret, redirectUri };
}

export function buildRobloxAuthorizeUrl(state: string) {
  const { clientId, redirectUri } = getConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile",
    response_type: "code",
    state,
  });
  return `${ROBLOX_AUTHORIZE_URL}?${params.toString()}`;
}

export interface RobloxProfile {
  robloxUserId: string;
  robloxUsername: string;
}

// Exchanges an authorization code for tokens, then fetches the Roblox
// profile (sub = Roblox user id, preferred_username = Roblox username).
// https://create.roblox.com/docs/cloud/reference/oauth2
export async function exchangeRobloxCode(code: string): Promise<RobloxProfile> {
  const { clientId, clientSecret, redirectUri } = getConfig();

  const tokenRes = await fetch(ROBLOX_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Roblox token exchange failed (${tokenRes.status})`);
  }
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const userRes = await fetch(ROBLOX_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) {
    throw new Error(`Roblox userinfo fetch failed (${userRes.status})`);
  }
  const profile = (await userRes.json()) as { sub: string; preferred_username: string };

  return { robloxUserId: profile.sub, robloxUsername: profile.preferred_username };
}
