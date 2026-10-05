import { withDefaultButtons } from "@/shared/defaultButtons";

const API_URL = __API_URL__;
const CONTENT_SCRIPT = "content/content.js";

let isCapturing = false;

// 툴바(content script)에서 보낸 메시지는 sender.tab 기준으로 처리한다
const tabMessageHandlers = {
  goToNextTab: (tab) => switchTab(tab, 1),
  goToPreviousTab: (tab) => switchTab(tab, -1),
  openNewTab: handleNewTab,
  closeCurrentTab: (tab) => chrome.tabs.remove(tab.id),
  bookmarkCurrentTab: handleBookmarkTab,
  openTranslatedPage: handleTranslate,
  downloadImagesFromCurrentPage: handleImageDownload,
  captureVisibleTab: handleCaptureTab,
};

const asyncMessageHandlers = {
  fetchUser: () => apiRequest("/api/user/me"),
  syncUserSettings: (message) =>
    apiRequest("/api/user/me", { method: "PUT", body: message.settings }),
};

async function apiRequest(path, { method = "GET", body } = {}) {
  const { jwt } = await chrome.storage.local.get("jwt");
  if (!jwt) return null;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${jwt}`,
      ...(body && { "Content-Type": "application/json" }),
    },
    body: body && JSON.stringify(body),
  });

  if (res.status === 401) {
    await chrome.storage.local.remove(["jwt", "user"]);
    return null;
  }
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}

async function switchTab(currentTab, step) {
  const tabs = await chrome.tabs.query({ windowId: currentTab.windowId });
  const nextIndex = (currentTab.index + step + tabs.length) % tabs.length;
  const nextTab = tabs.find((tab) => tab.index === nextIndex);
  if (nextTab) chrome.tabs.update(nextTab.id, { active: true });
}

async function handleNewTab(tab) {
  const { addressOfNewTab } = await chrome.storage.local.get("addressOfNewTab");
  chrome.tabs.create({
    url: addressOfNewTab || "https://www.google.com",
    index: tab.index + 1,
    windowId: tab.windowId,
  });
}

async function handleBookmarkTab(tab) {
  const FOLDER_TITLE = "donuTool 북마크 폴더";
  const results = await chrome.bookmarks.search({ title: FOLDER_TITLE });
  let folder = results.find(
    (bookmarkNode) => bookmarkNode.title === FOLDER_TITLE && !bookmarkNode.url,
  );
  if (!folder) {
    folder = await chrome.bookmarks.create({ title: FOLDER_TITLE });
  }

  await chrome.bookmarks.create({
    parentId: folder.id,
    title: tab.title,
    url: tab.url,
  });
  chrome.tabs.sendMessage(tab.id, {
    action: "showBookmarkAlert",
    title: tab.title,
  });
}

function handleTranslate(tab) {
  const translatedUrl = `https://translate.google.com/translate?sl=auto&tl=ko&u=${encodeURIComponent(tab.url)}`;
  chrome.tabs.create({ url: translatedUrl, index: tab.index + 1 });
}

async function handleImageDownload(tab) {
  const noSpaceTitle = tab.title.replace(/\s+/g, "");
  const trimmedTitle =
    noSpaceTitle.length > 15 ? `${noSpaceTitle.slice(0, 15)}...` : noSpaceTitle;
  const safeTitle = trimmedTitle.replace(/[^\p{L}\p{N}_\-()[\]]/gu, "_");

  const [injectionResult] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () =>
      Array.from(document.querySelectorAll("img"))
        .map((img) => img.src)
        .filter((src) => src && !src.startsWith("data:")),
  });

  const urls = injectionResult?.result;
  if (!urls || urls.length === 0) {
    chrome.tabs.sendMessage(tab.id, { action: "noImagesAvailable" });
    return;
  }

  urls.forEach((url, index) => {
    chrome.downloads.download({
      url,
      filename: `${safeTitle}/image-${index + 1}.jpg`,
      saveAs: false,
    });
  });
  chrome.tabs.sendMessage(tab.id, { action: "imagesDownloadSuccess" });
}

async function handleCaptureTab(tab) {
  if (isCapturing) return;
  isCapturing = true;

  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: "setToolbarHidden",
      hidden: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
    });
    chrome.tabs.sendMessage(tab.id, {
      action: "downloadCapturedImage",
      dataUrl,
      title: tab.title,
    });
  } finally {
    isCapturing = false;
    chrome.tabs
      .sendMessage(tab.id, { action: "setToolbarHidden", hidden: false })
      .catch(() => {});
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const { buttonsSetting } = await chrome.storage.local.get("buttonsSetting");
  chrome.storage.local.set({ buttonsSetting: withDefaultButtons(buttonsSetting) });

  // manifest의 content_scripts는 이미 열려 있던 탭에는 주입되지 않으므로 직접 주입
  const tabs = await chrome.tabs.query({ url: ["http://*/*", "https://*/*"] });
  tabs.forEach((tab) => {
    chrome.scripting
      .executeScript({ target: { tabId: tab.id }, files: [CONTENT_SCRIPT] })
      .catch(() => {});
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const asyncHandler = asyncMessageHandlers[message.action];
  if (asyncHandler) {
    asyncHandler(message)
      .then((data) => sendResponse({ data }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }

  const tabHandler = tabMessageHandlers[message.action];
  if (tabHandler && sender.tab) {
    Promise.resolve(tabHandler(sender.tab, message)).catch((error) =>
      console.error(`Failed to handle ${message.action}:`, error),
    );
  }
});

// 대시보드 웹(manifest의 externally_connectable에 등록된 origin)만 호출 가능
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message?.action === "getSession") {
    chrome.storage.local.get("jwt", ({ jwt }) => {
      sendResponse({ token: jwt ?? null });
    });
    return true;
  }
});
