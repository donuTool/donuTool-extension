const CLIENT_ID =
  "325276288422-aahdc7m6294700qevqsad4g5vgng904g.apps.googleusercontent.com";
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
    `&scope=openid email profile`;

  if (options.prompt) {
    authUrl += `&prompt=${encodeURIComponent(options.prompt)}`;
  }

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      async (redirectUrl) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);

        const url = new URL(redirectUrl);
        const code = url.searchParams.get("code");

        if (!code) return reject("No code returned");

        try {
          chrome.storage.local.get(
            ["buttonsSetting", "isDarkMode"],
            async (result) => {
              const initialButtonsSetting = result.buttonsSetting || [];
              const initialIsDarkMode = result.isDarkMode ?? false;

              const res = await fetch(
                "http://localhost:3001/auth/google/token",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    code,
                    redirectUri: REDIRECT_URI,
                    buttonsSetting: initialButtonsSetting,
                    isDarkMode: initialIsDarkMode,
                  }),
                },
              );

              if (!res.ok) {
                return reject("Failed to exchange code for token");
              }

              const data = await res.json();
              resolve(data);
            },
          );
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}
