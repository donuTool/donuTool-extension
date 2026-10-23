import { describe, expect, it } from "vitest";
import { DEFAULT_BUTTONS } from "./defaultButtons";
import { normalizeAddress, pickSyncedSettings, sanitizeSettings } from "./settings";

describe("normalizeAddress", () => {
  it("스킴이 없으면 https://를 붙인다", () => {
    expect(normalizeAddress("naver.com")).toBe("https://naver.com/");
    expect(normalizeAddress("  http://example.com/path ")).toBe("http://example.com/path");
  });

  it("한글 도메인과 localhost 포트를 허용한다", () => {
    expect(normalizeAddress("한글.kr")).toMatch(/^https:\/\/xn--/);
    expect(normalizeAddress("localhost:3000")).toBe("https://localhost:3000/");
  });

  it("주소가 아니면 null", () => {
    expect(normalizeAddress("google")).toBeNull();
    expect(normalizeAddress("hello world.com")).toBeNull();
    expect(normalizeAddress("javascript://alert(1)")).toBeNull();
    expect(normalizeAddress("")).toBeNull();
  });
});

describe("sanitizeSettings", () => {
  it("올바른 값만 남긴다", () => {
    expect(
      sanitizeSettings({
        buttonsSetting: DEFAULT_BUTTONS,
        isDarkMode: true,
        donuToolActive: "yes",
        jwt: "evil",
      }),
    ).toEqual({ buttonsSetting: DEFAULT_BUTTONS, isDarkMode: true });
  });

  it("알 수 없는 버튼이나 아이콘이 있으면 버튼 설정을 버린다", () => {
    const tampered = [{ id: "goBack", image: "../evil", status: "IN_TOOLBAR" }];
    expect(sanitizeSettings({ buttonsSetting: tampered })).toEqual({});
  });

  it("서버 동기화 대상에서 툴바 on/off는 뺀다", () => {
    expect(pickSyncedSettings({ isDarkMode: false, donuToolActive: true })).toEqual({
      isDarkMode: false,
    });
  });
});
