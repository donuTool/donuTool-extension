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

  const buttonsSetting = await new Promise((resolve) => {
    chrome.storage.local.get("buttonsSetting", (data) => {
      const allSettings = data.buttonsSetting || [];
      resolve(allSettings.slice(9, 14));
    });
  });

  const toolBarButtonElement1 = await createToolBarButton("donuTool-button1", "18px", "112px", buttonsSetting[0].image, buttonsSetting[0].id);
  toolBarElement.appendChild(toolBarButtonElement1);

  const toolBarButtonElement2 = await createToolBarButton("donuTool-button2", "64px", "131px", buttonsSetting[1].image, buttonsSetting[1].id);
  toolBarElement.appendChild(toolBarButtonElement2);

  const toolBarButtonElement3 = await createToolBarButton("donuTool-button3", "112px", "112px", buttonsSetting[2].image, buttonsSetting[2].id);
  toolBarElement.appendChild(toolBarButtonElement3);

  const toolBarButtonElement4 = await createToolBarButton("donuTool-button4", "131px", "64px", buttonsSetting[3].image, buttonsSetting[3].id);
  toolBarElement.appendChild(toolBarButtonElement4);

  const toolBarButtonElement5 = await createToolBarButton("donuTool-button5", "111px", "19px", buttonsSetting[4].image, buttonsSetting[4].id);
  toolBarElement.appendChild(toolBarButtonElement5);

  return toolBarElement;
}

async function createToolBarButton(id, top, left, svgName, actionKey) {
  const { buttonActions } = await import(chrome.runtime.getURL("overlay/buttonActions.js"));
  const onClick = buttonActions[actionKey];

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

  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "darkgray";
    button.style.transform = (button.style.transform || "").replace(/scale\([^)]*\)/g, "").trim() + " scale(1.2)";
    svgImg.style.filter = "brightness(2)";
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "lightgray";
    button.style.transform = (button.style.transform || "").replace(/scale\([^)]*\)/g, "").trim() + " scale(1)";
    svgImg.style.filter = "none";
  });

  return button;
}
