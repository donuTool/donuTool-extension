const CLIENT_ID = __GOOGLE_CLIENT_ID__;
const API_URL = __API_URL__;
const REDIRECT_URI =
  typeof chrome !== "undefined" && chrome.runtime?.id
    ? `https://${chrome.runtime.id}.chromiumapp.org/`
    : "";

export async function googleLogin(options = {}) {
  let authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent("openid email profile")}`;

  if (options.prompt) {
    authUrl += `&prompt=${encodeURIComponent(options.prompt)}`;
  }

  const redirectUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true,
  });

  const code = new URL(redirectUrl).searchParams.get("code");
  if (!code) throw new Error("No code returned");

  const result = await chrome.storage.local.get([
    "buttonClickCounts",
    "buttonsSetting",
    "isDarkMode",
    "addressOfNewTab",
  ]);

  const res = await fetch(`${API_URL}/auth/google/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      redirectUri: REDIRECT_URI,
      buttonClickCounts: result.buttonClickCounts ?? {},
      buttonsSetting: result.buttonsSetting || [],
      isDarkMode: result.isDarkMode ?? false,
      addressOfNewTab: result.addressOfNewTab ?? "https://google.com",
    }),
  });

  if (!res.ok) throw new Error("Failed to exchange code for token");

  return res.json();
}
