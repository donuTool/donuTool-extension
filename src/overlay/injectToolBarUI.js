(async () => {
  const { updateToolBarUIPosition, checkCursorEvent, getRotationAngle, getReverseRotationAngle } = await import(chrome.runtime.getURL("overlay/toolBarUtils.js"));
  const { createToolBarElement } = await import(chrome.runtime.getURL("overlay/toolBarElement.js"));
  const { handleMessageAction } = await import(chrome.runtime.getURL("overlay/handleMessageAction.js"));

  const alertBox = document.createElement("div");
  Object.assign(alertBox.style, {
    position: "absolute",
    top: "-4vh",
    left: "50%",
    display: "flex",
    width: "21vw",
    height: "4vh",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1vw",
    fontWeight: "500",
    color: "#808080",
    backgroundColor: "#EDEFEF",
    borderRadius: "0 0 0.9rem 0.9rem",
    transform: "translateX(-50%)",
    transition: "transform 0.5s ease",
    zIndex: 10000,
  });
  document.body.appendChild(alertBox);

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.buttonsSetting) {
      toolBarUI = createToolBarElement();
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    const result = handleMessageAction[message.action]?.(message);

    if (result) {
      alertBox.innerText = result;
      alertBox.style.transform = "translateX(-50%) translateY(4vh)";
      setTimeout(() => {
        alertBox.style.transform = "translateX(-50%) translateY(-4vh)";
      }, 2000);
    }
  });

  let isElementInteractive = false;
  let isMouseDown = false;
  let lastCursorPosition = { x: 0, y: 0 };
  let lastScrollYPosition = window.scrollY;

  let toolBarUI = await createToolBarElement();
  document.body.appendChild(toolBarUI);

  const buttonsInToolBar = [];

  for (let i = 1; i < 6; i++) {
    buttonsInToolBar.push(document.getElementById(`donuTool-button${i}`));
  }

  window.addEventListener("mousedown", () => {
    if (!isElementInteractive) {
      isMouseDown = true;
      updateToolBarUIPosition(toolBarUI, lastCursorPosition);
      toolBarUI.style.pointerEvents = "auto";
      document.body.style.pointerEvents = "none";
      document.body.style.webkitUserDrag = "none";
      document.body.style.userSelect = "none";
    }
  });

  window.addEventListener("mouseup", (e) => {
    isMouseDown = false;
    lastCursorPosition = {
      x: e.pageX,
      y: e.pageY,
    };

    toolBarUI.style.transition = "left 0.3s ease, top 0.3s ease";
    updateToolBarUIPosition(toolBarUI, lastCursorPosition);
    toolBarUI.style.pointerEvents = "none";
    document.body.style.pointerEvents = "auto";
    document.body.style.webkitUserDrag = "auto";
    document.body.style.userSelect = "auto";

    setTimeout(() => {
      toolBarUI.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    }, 200);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isMouseDown || isElementInteractive) {
      lastCursorPosition = {
        x: e.pageX,
        y: e.pageY,
      };
      updateToolBarUIPosition(toolBarUI, lastCursorPosition);
      toolBarUI.style.transform = getRotationAngle(e.clientX, e.clientY, window.innerWidth, window.innerHeight);

      buttonsInToolBar.forEach((button) => {
        button.style.transform = getReverseRotationAngle(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
        button.style.transition = "transform 0.3s ease, background-color 0.3s ease";
      });
    }

    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    isElementInteractive = checkCursorEvent(elementUnderCursor);
    toolBarUI.style.opacity = isElementInteractive ? 0.3 : 1;
  });

  document.addEventListener(
    "scroll",
    () => {
      const deltaY = window.scrollY - lastScrollYPosition;
      lastCursorPosition.y += deltaY;
      lastScrollYPosition = window.scrollY;
      updateToolBarUIPosition(toolBarUI, lastCursorPosition);
    },
    true
  );

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && e.shiftKey && e.metaKey) {
      chrome.storage.local.get(
        ("donuToolActive",
        (data) => {
          if (data.donuToolActive) {
            alertBox.innerText = "툴바 일시 비활성화됨";
            toolBarUI.style.display = "none";
            chrome.storage.local.set({ donuToolActive: false });
          } else {
            alertBox.innerText = "툴바 활성화됨";
            toolBarUI.style.display = "flex";
            chrome.storage.local.set({ donuToolActive: true });
          }
        })
      );

      alertBox.style.transform = "translateX(-50%) translateY(4vh)";

      setTimeout(() => {
        alertBox.style.transform = "translateX(-50%) translateY(-4vh)";
      }, 2000);
    }
  });
})();
