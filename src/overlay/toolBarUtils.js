export function updateToolBarUIPosition(element, position) {
  element.style.left = position.x - 52 + "px";
  element.style.top = position.y - 44 + "px";
}

export function checkCursorEvent(element) {
  while (element && element !== document.body) {
    const style = window.getComputedStyle(element);

    if (
      (style.userSelect === "text" || style.userSelect === "auto") &&
      element.childNodes &&
      Array.from(element.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim() !== "",
      )
    ) {
      return true;
    }

    if (isInteractiveElement(element)) {
      return true;
    }

    if (
      style.cursor !== "auto" &&
      style.cursor !== "default" &&
      style.cursor !== "grabbing"
    )
      return true;

    element = element.parentElement;
  }
  return false;
}

export function getRotationAngle(x, y, width, height) {
  const MARGIN = 90;
  const actualWidth = Math.min(width, document.documentElement.clientWidth);

  if (x < MARGIN && y > height - MARGIN) return "rotate(-90deg)";
  if (y < MARGIN && x > width - MARGIN) return "rotate(90deg)";
  if (x > width - MARGIN && y > height - MARGIN) return "rotate(180deg)";
  if (x < MARGIN) return "rotate(-45deg)";
  if (x > actualWidth - MARGIN) return "rotate(135deg)";
  if (y < MARGIN) return "rotate(45deg)";
  if (y > height - MARGIN) return "rotate(-135deg)";
  return "rotate(0deg)";
}

export function getReverseRotationAngle(x, y, width, height) {
  const MARGIN = 90;
  if (x < MARGIN && y > height - MARGIN) return "rotate(90deg)";
  if (y < MARGIN && x > width - MARGIN) return "rotate(-90deg)";
  if (x > width - MARGIN && y > height - MARGIN) return "rotate(-180deg)";
  if (x < MARGIN) return "rotate(45deg)";
  if (x > width - MARGIN) return "rotate(-135deg)";
  if (y < MARGIN) return "rotate(-45deg)";
  if (y > height - MARGIN) return "rotate(135deg)";
  return "rotate(0deg)";
}

function isInteractiveElement(el) {
  const tag = el.tagName;
  if (tag === "VIDEO" || tag === "AUDIO") return true;
  if (tag === "BUTTON" || tag === "A" || tag === "INPUT" || tag === "TEXTAREA")
    return true;
  if (el.isContentEditable) return true;
  return false;
}
