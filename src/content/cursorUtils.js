const EDGE_MARGIN = 90;

const INTERACTIVE_SELECTOR =
  "a[href], button, input, textarea, select, label, summary, video, audio, " +
  "[contenteditable=''], [contenteditable='true'], [role='button'], [role='link']";

// 화면 가장자리에서 툴바 버튼이 잘리지 않도록 회전할 각도(deg)
export function getRotationDegree(x, y, width, height) {
  const nearLeft = x < EDGE_MARGIN;
  const nearRight = x > width - EDGE_MARGIN;
  const nearTop = y < EDGE_MARGIN;
  const nearBottom = y > height - EDGE_MARGIN;

  if (nearLeft && nearBottom) return -90;
  if (nearTop && nearRight) return 90;
  if (nearRight && nearBottom) return 180;
  if (nearLeft) return -45;
  if (nearRight) return 135;
  if (nearTop) return 45;
  if (nearBottom) return -135;
  return 0;
}

// cursor 속성은 상속되므로 대상 요소 하나만 확인하면 된다
export function isInteractiveElement(element) {
  if (!(element instanceof Element)) return false;
  if (element.closest(INTERACTIVE_SELECTOR)) return true;

  const { cursor } = window.getComputedStyle(element);
  return cursor !== "auto" && cursor !== "default";
}

// 커서 위치에 실제 텍스트가 있으면 텍스트 선택을 위해 툴바를 띄우지 않는다
export function isOverText(x, y) {
  const range = document.caretRangeFromPoint?.(x, y);
  const node = range?.startContainer;
  if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) {
    return false;
  }

  const textRange = document.createRange();
  textRange.selectNodeContents(node);
  return Array.from(textRange.getClientRects()).some(
    (rect) =>
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
  );
}
