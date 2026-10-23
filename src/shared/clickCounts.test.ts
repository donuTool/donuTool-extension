import { describe, expect, it } from "vitest";
import { addCounts, splitForUpload } from "./clickCounts";

describe("addCounts", () => {
  it("버튼별로 횟수를 더한다", () => {
    expect(addCounts({ goBack: 2 }, { goBack: 1, newTab: 3 })).toEqual({
      goBack: 3,
      newTab: 3,
    });
  });

  it("비어 있거나 잘못된 값은 무시한다", () => {
    expect(addCounts(undefined, { goBack: 1 })).toEqual({ goBack: 1 });
    expect(addCounts({ goBack: 1 }, null)).toEqual({ goBack: 1 });
    expect(addCounts({}, { goBack: -1, newTab: 1.5 })).toEqual({});
  });
});

describe("splitForUpload", () => {
  it("한 번에 보낼 수 있는 만큼만 보내고 나머지는 남긴다", () => {
    expect(splitForUpload({ goBack: 1500, newTab: 2 }, 1000)).toEqual({
      toSend: { goBack: 1000, newTab: 2 },
      remaining: { goBack: 500 },
    });
  });

  it("보낼 것이 없으면 빈 객체", () => {
    expect(splitForUpload(undefined)).toEqual({ toSend: {}, remaining: {} });
  });
});
