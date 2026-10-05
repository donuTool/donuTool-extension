import { afterEach, describe, expect, it, vi } from "vitest";

async function loadMessages(uiLanguage: string) {
  vi.resetModules();
  vi.stubGlobal("chrome", { i18n: { getUILanguage: () => uiLanguage } });
  return import("./messages");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("t", () => {
  it("한국어 UI면 한국어 문구를 쓴다", async () => {
    const { t } = await loadMessages("ko-KR");
    expect(t("bookmarkDone", { title: "네이버" })).toBe("네이버 페이지 북마크 완료");
  });

  it("그 외 언어는 영어 문구를 쓴다", async () => {
    const { t } = await loadMessages("ja");
    expect(t("imagesDownloading", { count: 3 })).toBe("Downloading 3 images");
  });
});

describe("trimTitle", () => {
  it("15자를 넘으면 자른다", async () => {
    const { trimTitle } = await loadMessages("ko");
    expect(trimTitle("1234567890123456")).toBe("123456789012345...");
    expect(trimTitle("short")).toBe("short");
  });
});
