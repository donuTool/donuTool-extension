import { styles, CURSOR_OFFSET } from "./styles.js";

const BUTTON_POSITIONS = [
  { top: 18, left: 112 },
  { top: 64, left: 131 },
  { top: 112, left: 112 },
  { top: 131, left: 64 },
  { top: 111, left: 19 },
];
const ALERT_DURATION = 2000;
const GLIDE_DURATION = 300;

// 페이지 CSS의 영향을 받지 않도록 closed Shadow DOM 안에 툴바를 그린다
export function createToolbarUI({ onButtonClick }) {
  const host = document.createElement("donutool-root");
  const shadow = host.attachShadow({ mode: "closed" });

  const style = document.createElement("style");
  style.textContent = styles;

  const overlay = document.createElement("div");
  overlay.className = "overlay";

  const positioner = document.createElement("div");
  positioner.className = "positioner";

  const ring = document.createElement("div");
  ring.className = "ring";

  const ringImage = document.createElement("img");
  ringImage.className = "ring-image";
  ringImage.src = chrome.runtime.getURL("assets/donuToolBar.png");
  ringImage.draggable = false;

  const buttonContainer = document.createElement("div");

  const alertBox = document.createElement("div");
  alertBox.className = "alert";

  ring.append(ringImage, buttonContainer);
  positioner.append(ring);
  shadow.append(style, overlay, positioner, alertBox);

  let isMounted = false;
  let rotation = null;
  let alertTimer = null;
  let glideTimer = null;

  const attach = () => {
    if (!host.isConnected) document.documentElement.appendChild(host);
  };

  const detachIfIdle = () => {
    if (!isMounted && !alertBox.classList.contains("visible")) host.remove();
  };

  return {
    host,

    setMounted(mounted) {
      isMounted = mounted;
      positioner.hidden = !mounted;
      if (mounted) {
        attach();
      } else {
        overlay.classList.remove("active");
        detachIfIdle();
      }
    },

    renderButtons(buttonsSetting) {
      const buttons = BUTTON_POSITIONS.map((position, index) => {
        const setting = buttonsSetting[index];
        if (!setting) return null;

        const button = document.createElement("div");
        button.className = "button";
        button.style.top = `${position.top}px`;
        button.style.left = `${position.left}px`;

        const icon = document.createElement("img");
        icon.src = chrome.runtime.getURL(`assets/${setting.image}.svg`);
        icon.draggable = false;
        button.append(icon);

        button.addEventListener("mouseup", () => onButtonClick(setting.id));
        return button;
      }).filter(Boolean);

      buttonContainer.replaceChildren(...buttons);
    },

    moveTo(x, y) {
      positioner.style.transform = `translate3d(${x - CURSOR_OFFSET.x}px, ${y - CURSOR_OFFSET.y}px, 0)`;
    },

    glideTo(x, y) {
      positioner.classList.add("gliding");
      this.moveTo(x, y);
      clearTimeout(glideTimer);
      glideTimer = setTimeout(
        () => positioner.classList.remove("gliding"),
        GLIDE_DURATION,
      );
    },

    setRotation(degree) {
      if (degree === rotation) return;
      rotation = degree;
      ring.style.setProperty("--rotation", `${degree}deg`);
    },

    setDimmed(dimmed) {
      ring.classList.toggle("dimmed", dimmed);
    },

    setHolding(holding) {
      overlay.classList.toggle("active", holding);
    },

    setToolbarHidden(hidden) {
      positioner.classList.toggle("hidden", hidden);
    },

    showAlert(text) {
      attach();
      alertBox.textContent = text;
      alertBox.classList.add("visible");
      clearTimeout(alertTimer);
      alertTimer = setTimeout(() => {
        alertBox.classList.remove("visible");
        alertTimer = setTimeout(detachIfIdle, 500);
      }, ALERT_DURATION);
    },

    destroy() {
      clearTimeout(alertTimer);
      clearTimeout(glideTimer);
      host.remove();
    },
  };
}
