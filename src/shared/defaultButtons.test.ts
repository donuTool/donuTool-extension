import { describe, expect, it } from "vitest";
import { DEFAULT_BUTTONS, withDefaultButtons } from "./defaultButtons";

describe("withDefaultButtons", () => {
  it.each([undefined, null, []])("빈 설정(%s)이면 기본값을 반환한다", (value) => {
    expect(withDefaultButtons(value)).toEqual(DEFAULT_BUTTONS);
  });

  it("기본값을 복사해서 반환한다", () => {
    const buttons = withDefaultButtons();
    buttons[0].id = "changed";
    expect(DEFAULT_BUTTONS[0].id).toBe("goBack");
  });

  it("설정이 있으면 그대로 반환한다", () => {
    const setting = [{ id: "reload", image: "rotate", status: "IN_TOOLBAR" }];
    expect(withDefaultButtons(setting)).toBe(setting);
  });
});
