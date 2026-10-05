const TOOLBAR_BUTTON_POSITIONS = [
  ["18px", "112px"],
  ["64px", "131px"],
  ["112px", "112px"],
  ["131px", "64px"],
  ["111px", "19px"],
];

export async function createToolBarElement() {
  const toolBarElement = document.createElement("div");
  toolBarElement.id = "donuTool-toolBar";
  toolBarElement.setAttribute("draggable", "false");
  Object.assign(toolBarElement.style, {
    position: "absolute",
    pointerEvents: "none",
    webkitUserDrag: "none",
    userSelect: "none",
    zIndex: 9999,
    transition: "opacity 0.3s ease, transform 0.3s ease",
  });

  const toolBarImage = document.createElement("img");
  toolBarImage.src = chrome.runtime.getURL("assets/donuToolBar.png");
  Object.assign(toolBarImage.style, {
    width: "180px",
    height: "180px",
    filter: "brightness(1.15)",
    pointerEvents: "none",
    webkitUserDrag: "none",
    userSelect: "none",
  });
  toolBarElement.appendChild(toolBarImage);

  const { withDefaultButtons } = await import(
    chrome.runtime.getURL("overlay/defaultButtons.js")
  );
  const buttonsSetting = await new Promise((resolve) => {
    chrome.storage.local.get("buttonsSetting", (data) => {
      resolve(withDefaultButtons(data.buttonsSetting).slice(0, 5));
    });
  });

  for (const [index, [top, left]] of TOOLBAR_BUTTON_POSITIONS.entries()) {
    const setting = buttonsSetting[index];
    if (!setting) continue;

    const toolBarButtonElement = await createToolBarButton(
      `donuTool-button${index + 1}`,
      top,
      left,
      setting.image,
      setting.id,
    );
    toolBarElement.appendChild(toolBarButtonElement);
  }

  return toolBarElement;
}

async function createToolBarButton(id, top, left, svgName, actionKey) {
  const { buttonActions } = await import(
    chrome.runtime.getURL("overlay/buttonActions.js")
  );
  const onClick = buttonActions[actionKey];

  const button = document.createElement("div");
  button.id = id;
  button.addEventListener("mouseup", (event) => {
    if (typeof onClick === "function") {
      onClick(event);
    }
    chrome.storage.local.get("buttonClickCounts", (data) => {
      const storedCounts = data.buttonClickCounts || {};
      storedCounts[actionKey] = (storedCounts[actionKey] || 0) + 1;
      chrome.storage.local.set({ buttonClickCounts: storedCounts });
      chrome.runtime.sendMessage({
        action: "syncUserSettings",
        settings: { buttonClickCounts: storedCounts },
      });
    });
  });
  Object.assign(button.style, {
    position: "absolute",
    top: top,
    left: left,
    display: "flex",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    backgroundColor: "lightgray",
    cursor: "grabbing",
    transform: "scale(1)",
    pointerEvents: "auto",
  });

  const svgImg = document.createElement("img");
  svgImg.src = chrome.runtime.getURL(`assets/${svgName}.svg`);
  Object.assign(svgImg.style, {
    width: "25px",
    height: "25px",
    display: "block",
    pointerEvents: "none",
    transition: "filter 0.3s ease",
  });

  button.appendChild(svgImg);

  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "darkgray";
    button.style.transform =
      (button.style.transform || "").replace(/scale\([^)]*\)/g, "").trim() +
      " scale(1.2)";
    svgImg.style.filter = "brightness(2)";
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "lightgray";
    button.style.transform =
      (button.style.transform || "").replace(/scale\([^)]*\)/g, "").trim() +
      " scale(1)";
    svgImg.style.filter = "none";
  });

  return button;
}
