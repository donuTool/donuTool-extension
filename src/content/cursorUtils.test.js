import { describe, expect, it } from "vitest";
import { getRotationDegree } from "./cursorUtils.js";

const WIDTH = 1200;
const HEIGHT = 800;

describe("getRotationDegree", () => {
  it.each([
    ["center", 600, 400, 0],
    ["left edge", 20, 400, -45],
    ["right edge", 1180, 400, 135],
    ["top edge", 600, 20, 45],
    ["bottom edge", 600, 780, -135],
    ["bottom-left corner", 20, 780, -90],
    ["top-right corner", 1180, 20, 90],
    ["bottom-right corner", 1180, 780, 180],
    ["top-left corner", 20, 20, -45],
  ])("%s", (_, x, y, expected) => {
    expect(getRotationDegree(x, y, WIDTH, HEIGHT)).toBe(expected);
  });
});
