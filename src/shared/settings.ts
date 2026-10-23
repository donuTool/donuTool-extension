import type { Button } from "@/stores/types";
import { DEFAULT_BUTTONS } from "@/shared/defaultButtons";

const BUTTON_IMAGES = new Map(DEFAULT_BUTTONS.map((b) => [b.id, b.image]));
const BUTTON_STATUSES = ["IN_TOOLBAR", "IN_LIST"];

export type SyncedSettings = {
  buttonsSetting?: Button[];
  isDarkMode?: boolean;
  addressOfNewTab?: string;
};

export type ExternalSettings = SyncedSettings & { donuToolActive?: boolean };

// 사용자가 입력한 새 탭 주소를 http(s) URL로 바꾼다. 올바르지 않으면 null
// (한글 도메인, localhost:포트 등도 허용)
export function normalizeAddress(input: string): string | null {
  const value = input.trim();
  if (!value || /\s/.test(value)) return null;

  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;

  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    const { hostname } = url;
    const isLocal = hostname === "localhost" || /^[\d.]+$/.test(hostname);
    if (!isLocal && !hostname.includes(".")) return null;

    return url.href;
  } catch {
    return null;
  }
}

export function isValidButtonsSetting(value: unknown): value is Button[] {
  if (!Array.isArray(value) || value.length === 0) return false;

  const ids = new Set<string>();
  return value.every((button) => {
    if (!button || typeof button !== "object") return false;
    const { id, image, status } = button as Button;
    if (BUTTON_IMAGES.get(id) !== image || ids.has(id)) return false;
    ids.add(id);
    return BUTTON_STATUSES.includes(status);
  });
}

// 대시보드 웹에서 받은 설정 중 올바른 값만 남긴다
export function sanitizeSettings(input: unknown): ExternalSettings {
  const settings: ExternalSettings = {};
  if (!input || typeof input !== "object") return settings;
  const raw = input as Record<string, unknown>;

  if (isValidButtonsSetting(raw.buttonsSetting)) {
    settings.buttonsSetting = raw.buttonsSetting;
  }
  if (typeof raw.isDarkMode === "boolean") {
    settings.isDarkMode = raw.isDarkMode;
  }
  if (typeof raw.addressOfNewTab === "string") {
    const address = normalizeAddress(raw.addressOfNewTab);
    if (address) settings.addressOfNewTab = address;
  }
  if (typeof raw.donuToolActive === "boolean") {
    settings.donuToolActive = raw.donuToolActive;
  }

  return settings;
}

// 서버와 동기화하는 설정만 꺼낸다 (툴바 on/off는 기기별 상태)
export function pickSyncedSettings(settings: ExternalSettings): SyncedSettings {
  const { buttonsSetting, isDarkMode, addressOfNewTab } = settings;
  return Object.fromEntries(
    Object.entries({ buttonsSetting, isDarkMode, addressOfNewTab }).filter(
      ([, value]) => value !== undefined,
    ),
  );
}
