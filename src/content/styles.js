export const TOOLBAR_SIZE = 180;
// 툴바 이미지 안에서 커서가 위치할 지점
export const CURSOR_OFFSET = { x: 83, y: 73 };

export const styles = `
  :host {
    all: initial;
  }

  .overlay {
    position: fixed;
    inset: 0;
    display: none;
    cursor: grabbing;
    pointer-events: auto;
  }

  .overlay.active {
    display: block;
  }

  .positioner {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    will-change: transform;
  }

  .positioner.gliding {
    transition: transform 0.3s ease;
  }

  .positioner.hidden {
    visibility: hidden;
  }

  .ring {
    position: relative;
    width: ${TOOLBAR_SIZE}px;
    height: ${TOOLBAR_SIZE}px;
    transform: rotate(var(--rotation, 0deg));
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .ring.dimmed {
    opacity: 0.3;
  }

  .ring-image {
    display: block;
    width: 100%;
    height: 100%;
    filter: brightness(1.15);
    user-select: none;
    -webkit-user-drag: none;
  }

  .button {
    position: absolute;
    display: flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: lightgray;
    cursor: grabbing;
    pointer-events: auto;
    transform: rotate(calc(var(--rotation, 0deg) * -1)) scale(var(--scale, 1));
    transition: transform 0.3s ease, background-color 0.3s ease;
  }

  .button:hover {
    --scale: 1.2;
    background-color: darkgray;
  }

  .button img {
    display: block;
    width: 25px;
    height: 25px;
    pointer-events: none;
    transition: filter 0.3s ease;
    -webkit-user-drag: none;
  }

  .button:hover img {
    filter: brightness(2);
  }

  .alert {
    position: fixed;
    top: 0;
    left: 50%;
    min-width: 280px;
    padding: 10px 24px;
    border-radius: 0 0 14px 14px;
    background-color: #edefef;
    color: #808080;
    font: 500 14px/1.4 system-ui, sans-serif;
    text-align: center;
    pointer-events: none;
    transform: translate(-50%, -100%);
    transition: transform 0.5s ease;
  }

  .alert.visible {
    transform: translate(-50%, 0);
  }
`;
