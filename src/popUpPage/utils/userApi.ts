import type { Button } from "@/stores/types";

export type ServerUser = {
  googleId: string;
  buttonsSetting?: Button[];
  buttonClickCounts?: Record<string, number>;
  isDarkMode?: boolean;
  addressOfNewTab?: string;
};

type UserSettings = Partial<Omit<ServerUser, "googleId">>;

async function requestBackground<T>(message: object): Promise<T | null> {
  const response = await chrome.runtime.sendMessage(message);
  if (response?.error) throw new Error(response.error);

  return response?.data ?? null;
}

// 로그인하지 않은(게스트) 경우 null
export function fetchUser() {
  return requestBackground<ServerUser>({ action: "fetchUser" });
}

export function syncUserSettings(settings: UserSettings) {
  return requestBackground<ServerUser>({
    action: "syncUserSettings",
    settings,
  }).catch((err) => console.error("Failed to sync settings to server:", err));
}
