import { withDefaultButtons } from "@/shared/defaultButtons";
import { buttonActions } from "./buttonActions.js";
import { alertMessages } from "./alertMessages.js";
import { createToolbarUI } from "./toolbarUI.js";
import {
  getRotationDegree,
  isInteractiveElement,
  isOverText,
} from "./cursorUtils.js";

const TEARDOWN_EVENT = "donutool:teardown";
const TOOLBAR_BUTTON_COUNT = 5;

// 확장프로그램 재설치/업데이트로 다시 주입되면 이전 인스턴스를 정리하고 새로 시작한다
document.dispatchEvent(new CustomEvent(TEARDOWN_EVENT));
init();

function init() {
  const lifetime = new AbortController();
  let pointerTracking = null;

  const ui = createToolbarUI({ onButtonClick: handleButtonClick });

  function handleButtonClick(actionKey) {
    buttonActions[actionKey]?.(ui);

    chrome.storage.local.get("buttonClickCounts", ({ buttonClickCounts }) => {
      const counts = { ...buttonClickCounts };
      counts[actionKey] = (counts[actionKey] || 0) + 1;
      chrome.storage.local.set({ buttonClickCounts: counts });
      chrome.runtime.sendMessage({
        action: "syncUserSettings",
        settings: { buttonClickCounts: counts },
      });
    });
  }

  async function renderButtons() {
    const { buttonsSetting } = await chrome.storage.local.get("buttonsSetting");
    ui.renderButtons(
      withDefaultButtons(buttonsSetting).slice(0, TOOLBAR_BUTTON_COUNT),
    );
  }

  function mount() {
    if (pointerTracking) return;
    pointerTracking = new AbortController();
    renderButtons();
    ui.setMounted(true);
    trackPointer(ui, pointerTracking.signal);
  }

  function unmount() {
    pointerTracking?.abort();
    pointerTracking = null;
    ui.setMounted(false);
  }

  function handleStorageChange(changes, areaName) {
    if (areaName !== "local") return;

    if ("donuToolActive" in changes) {
      if (changes.donuToolActive.newValue) mount();
      else unmount();
    }
    if ("buttonsSetting" in changes && pointerTracking) {
      renderButtons();
    }
  }

  function handleMessage(message, sender, sendResponse) {
    if (message.action === "setToolbarHidden") {
      ui.setToolbarHidden(message.hidden);
      requestAnimationFrame(() => sendResponse(true));
      return true;
    }

    const text = alertMessages[message.action]?.(message);
    if (text) ui.showAlert(text);
  }

  chrome.storage.onChanged.addListener(handleStorageChange);
  chrome.runtime.onMessage.addListener(handleMessage);

  // Mac: Cmd + Shift + /, Windows: Ctrl + Shift + /
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.code !== "Slash" || !event.shiftKey) return;
      if (!event.metaKey && !event.ctrlKey) return;

      event.preventDefault();
      chrome.storage.local.get("donuToolActive", ({ donuToolActive }) => {
        chrome.storage.local.set({ donuToolActive: !donuToolActive });
        ui.showAlert(donuToolActive ? "툴바 일시 비활성화됨" : "툴바 활성화됨");
      });
    },
    { signal: lifetime.signal },
  );

  document.addEventListener(
    TEARDOWN_EVENT,
    () => {
      lifetime.abort();
      pointerTracking?.abort();
      ui.destroy();
      try {
        chrome.storage.onChanged.removeListener(handleStorageChange);
        chrome.runtime.onMessage.removeListener(handleMessage);
      } catch {
        // 확장프로그램이 업데이트되어 이전 컨텍스트가 무효화된 경우
      }
    },
    { once: true, signal: lifetime.signal },
  );

  chrome.storage.local.get("donuToolActive", ({ donuToolActive }) => {
    if (donuToolActive) mount();
  });
}

function trackPointer(ui, signal) {
  let x = 0;
  let y = 0;
  let isHolding = false;
  let isFramePending = false;
  let lastTarget = null;
  let isTargetInteractive = false;

  const render = () => {
    isFramePending = false;
    if (isHolding) return;

    ui.moveTo(x, y);
    ui.setRotation(
      getRotationDegree(x, y, window.innerWidth, window.innerHeight),
    );
    ui.setDimmed(isTargetInteractive);
  };

  const release = () => {
    if (!isHolding) return;
    isHolding = false;
    ui.setHolding(false);
    ui.glideTo(x, y);
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      x = event.clientX;
      y = event.clientY;

      if (event.target !== lastTarget) {
        lastTarget = event.target;
        isTargetInteractive =
          event.target !== ui.host && isInteractiveElement(event.target);
      }

      if (!isHolding && !isFramePending) {
        isFramePending = true;
        requestAnimationFrame(render);
      }
    },
    { capture: true, passive: true, signal },
  );

  // 빈 영역을 누르고 있는 동안 툴바를 고정하고, 버튼 위에서 떼면 해당 기능을 실행한다
  window.addEventListener(
    "mousedown",
    (event) => {
      if (event.button !== 0 || isHolding || event.target === ui.host) return;
      if (isInteractiveElement(event.target)) return;
      if (isOverText(event.clientX, event.clientY)) return;

      event.preventDefault();
      x = event.clientX;
      y = event.clientY;
      isHolding = true;
      ui.moveTo(x, y);
      ui.setHolding(true);
    },
    { capture: true, signal },
  );

  window.addEventListener(
    "mouseup",
    (event) => {
      x = event.clientX;
      y = event.clientY;
      release();
    },
    { capture: true, signal },
  );

  window.addEventListener("blur", release, { signal });

  signal.addEventListener("abort", () => ui.setHolding(false));
}
