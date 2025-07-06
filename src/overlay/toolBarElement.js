export function createToolBarElement() {
  let addressOfNewTab = "https://www.google.com";

  chrome.storage.local.get("addressOfNewTab", (data) => {
    if (data.addressOfNewTab) {
      addressOfNewTab = data.addressOfNewTab;
    }
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.addressOfNewTab) {
      addressOfNewTab = changes.addressOfNewTab.newValue;
    }
  });

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

  const toolBarButtonElement1 = createToolBarButton("donuTool-button1", "18px", "112px", "arrow-left", () => {
    window.history.go(-1);
  });
  toolBarElement.appendChild(toolBarButtonElement1);

  const toolBarButtonElement2 = createToolBarButton("donuTool-button2", "64px", "131px", "arrow-right", () => {
    window.history.go(1);
  });
  toolBarElement.appendChild(toolBarButtonElement2);

  const toolBarButtonElement3 = createToolBarButton("donuTool-button3", "112px", "112px", "new", () => {
    chrome.storage.local.get("addressOfNewTab", (data) => {
      const target = data.addressOfNewTab || addressOfNewTab;
      window.open(target, "_blank");
    });
  });
  toolBarElement.appendChild(toolBarButtonElement3);

  const toolBarButtonElement4 = createToolBarButton("donuTool-button4", "131px", "64px", "arrow-right-to-line", () => {
    chrome.runtime.sendMessage({ action: "goToNextTab" });
  });
  toolBarElement.appendChild(toolBarButtonElement4);

  const toolBarButtonElement5 = createToolBarButton("donuTool-button5", "111px", "19px", "arrow-left-to-line", () => {
    chrome.runtime.sendMessage({ action: "goToPreviousTab" });
  });
  toolBarElement.appendChild(toolBarButtonElement5);

  return toolBarElement;
}

function createToolBarButton(id, top, left, svgName, onClick) {
  const button = document.createElement("div");
  button.id = id;
  button.addEventListener("mouseup", onClick);
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

  button.addEventListener("mouseenter", () => {
    Object.assign(button.style, {
      transform: "scale(1.1)",
      backgroundColor: "darkgray",
    });
    svgImg.style.filter = "brightness(2)";
  });

  button.addEventListener("mouseleave", () => {
    Object.assign(button.style, {
      transform: "scale(1)",
      backgroundColor: "lightgray",
    });
    svgImg.style.filter = "none";
  });

  return button;
}
