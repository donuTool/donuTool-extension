export type ClickCounts = Record<string, number>;

// 서버가 한 번의 요청에서 버튼별로 받는 최대 횟수 (backend MAX_CLICKS_PER_REQUEST)
export const MAX_CLICKS_PER_REQUEST = 1000;

const toCounts = (value: unknown): ClickCounts =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as ClickCounts)
    : {};

// 두 횟수 객체를 버튼별로 더한다
export function addCounts(base: unknown, extra: unknown): ClickCounts {
  const result: ClickCounts = { ...toCounts(base) };
  for (const [id, count] of Object.entries(toCounts(extra))) {
    if (!Number.isInteger(count) || count <= 0) continue;
    result[id] = (Number.isInteger(result[id]) ? result[id] : 0) + count;
  }
  return result;
}

// 서버로 보낼 몫과 다음 요청으로 미룰 나머지로 나눈다
export function splitForUpload(
  pending: unknown,
  max = MAX_CLICKS_PER_REQUEST,
): { toSend: ClickCounts; remaining: ClickCounts } {
  const toSend: ClickCounts = {};
  const remaining: ClickCounts = {};

  for (const [id, count] of Object.entries(toCounts(pending))) {
    if (!Number.isInteger(count) || count <= 0) continue;
    toSend[id] = Math.min(count, max);
    if (count > max) remaining[id] = count - max;
  }

  return { toSend, remaining };
}

export const hasCounts = (counts: ClickCounts) => Object.keys(counts).length > 0;
