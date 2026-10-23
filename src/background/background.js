import { DEFAULT_BUTTONS, withDefaultButtons } from "@/shared/defaultButtons";
import { t, uiLanguage } from "@/shared/messages";
import { addCounts, hasCounts, splitForUpload } from "@/shared/clickCounts";
import { pickSyncedSettings, sanitizeSettings } from "@/shared/settings";

const API_URL = __API_URL__;
const CONTENT_SCRIPT = "content/content.js";
const CLICK_FLUSH_DELAY = 3000;
const BUTTON_IDS = new Set(DEFAULT_BUTTONS.map((button) => button.id));

let isCapturing = false;

// 툴바(content script)에서 보낸 메시지는 sender.tab 기준으로 처리한다
const tabMessageHandlers = {
  goToNextTab: (tab) => switchTab(tab, 1),
  goToPreviousTab: (tab) => switchTab(tab, -1),
  openNewTab: handleNewTab,
  closeCurrentTab: (tab) => chrome.tabs.remove(tab.id),
  bookmarkCurrentTab: handleBookmarkTab,
  openTranslatedPage: handleTranslate,
  downloadImages: handleImageDownload,
  captureVisibleTab: handleCaptureTab,
  recordClick: (tab, message) => recordClick(message.id),
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

// storage를 읽고-수정하고-쓰는 작업이 서로 끼어들지 않도록 순서대로 실행한다
let storageQueue = Promise.resolve();
function withStorageLock(task) {
  const run = storageQueue.then(task);
  storageQueue = run.catch(() => {});
  return run;
}

// 클릭 횟수는 로컬에 바로 더하고, 로그인 상태면 pendingClicks에 모아 두었다가
// 몇 초마다 서버에 증가분만 보낸다 (전체 값을 덮어쓰면 다른 기기의 기록이 사라짐)
async function recordClick(id) {
  if (!BUTTON_IDS.has(id)) return;

  const isLoggedIn = await withStorageLock(async () => {
    const { buttonClickCounts, pendingClicks, jwt } =
      await chrome.storage.local.get(["buttonClickCounts", "pendingClicks", "jwt"]);
    const update = { buttonClickCounts: addCounts(buttonClickCounts, { [id]: 1 }) };
    if (jwt) update.pendingClicks = addCounts(pendingClicks, { [id]: 1 });
    await chrome.storage.local.set(update);
    return Boolean(jwt);
  });

  if (isLoggedIn) scheduleClickFlush();
}

let clickFlushTimer = null;
function scheduleClickFlush() {
  if (clickFlushTimer) return;
  clickFlushTimer = setTimeout(() => {
    clickFlushTimer = null;
    flushClicks().catch((error) => console.error("Failed to flush clicks:", error));
  }, CLICK_FLUSH_DELAY);
}

async function flushClicks() {
  const toSend = await withStorageLock(async () => {
    const { pendingClicks } = await chrome.storage.local.get("pendingClicks");
    const { toSend, remaining } = splitForUpload(pendingClicks);
    await chrome.storage.local.set({ pendingClicks: remaining });
    return toSend;
  });
  if (!hasCounts(toSend)) return;

  let data;
  try {
    data = await apiRequest("/api/user/me/clicks", {
      method: "POST",
      body: { counts: toSend },
    });
  } catch (error) {
    // 네트워크 오류 등: 다음에 다시 보낸다
    await withStorageLock(async () => {
      const { pendingClicks } = await chrome.storage.local.get("pendingClicks");
      await chrome.storage.local.set({ pendingClicks: addCounts(pendingClicks, toSend) });
    });
    throw error;
  }

  // 서버 값 + 아직 보내지 않은 클릭 = 이 기기에서 보여줄 값
  await withStorageLock(async () => {
    const { pendingClicks } = await chrome.storage.local.get("pendingClicks");
    if (data?.buttonClickCounts) {
      await chrome.storage.local.set({
        buttonClickCounts: addCounts(data.buttonClickCounts, pendingClicks),
      });
    }
    if (hasCounts(pendingClicks ?? {})) scheduleClickFlush();
  });
}

// 서버에 저장된 설정을 이 기기의 storage로 가져온다 (다른 기기나 대시보드에서 바꾼 값 반영)
async function syncFromServer() {
  const user = await apiRequest("/api/user/me");
  if (!user) return null;

  await withStorageLock(async () => {
    const { pendingClicks } = await chrome.storage.local.get("pendingClicks");
    const update = {
      user,
      buttonsSetting: withDefaultButtons(user.buttonsSetting),
      buttonClickCounts: addCounts(user.buttonClickCounts, pendingClicks),
    };
    if (typeof user.isDarkMode === "boolean") update.isDarkMode = user.isDarkMode;
    if (user.addressOfNewTab) update.addressOfNewTab = user.addressOfNewTab;
    await chrome.storage.local.set(update);
    if (hasCounts(pendingClicks ?? {})) scheduleClickFlush();
  });

  return user;
}

async function getState() {
  const user = await syncFromServer().catch((error) => {
    console.error("Failed to sync from server:", error);
    return null;
  });
  const state = await chrome.storage.local.get([
    "jwt",
    "donuToolActive",
    "buttonsSetting",
    "isDarkMode",
    "addressOfNewTab",
    "buttonClickCounts",
  ]);

  return {
    version: chrome.runtime.getManifest().version,
    isLoggedIn: Boolean(state.jwt),
    createdAt: user?.createdAt ?? null,
    donuToolActive: Boolean(state.donuToolActive),
    buttonsSetting: withDefaultButtons(state.buttonsSetting),
    isDarkMode: typeof state.isDarkMode === "boolean" ? state.isDarkMode : null,
    addressOfNewTab: state.addressOfNewTab ?? null,
    buttonClickCounts: state.buttonClickCounts ?? {},
  };
}

async function updateSettings(message) {
  const settings = sanitizeSettings(message.settings);
  if (Object.keys(settings).length === 0) throw new Error("No valid settings");

  await chrome.storage.local.set(settings);

  const synced = pickSyncedSettings(settings);
  if (Object.keys(synced).length > 0) {
    await apiRequest("/api/user/me", { method: "PUT", body: synced });
  }
  return getState();
}

async function resetStats() {
  await withStorageLock(() =>
    chrome.storage.local.set({ buttonClickCounts: {}, pendingClicks: {} }),
  );
  await apiRequest("/api/user/me/stats", { method: "DELETE" });
  return getState();
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
  const FOLDER_TITLE = t("bookmarkFolder");
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
  // 브라우저 언어로 번역 (zh-CN/zh-TW는 지역 코드까지 필요)
  const targetLanguage = uiLanguage.startsWith("zh")
    ? uiLanguage
    : uiLanguage.split("-")[0];
  const translatedUrl = `https://translate.google.com/translate?sl=auto&tl=${targetLanguage}&u=${encodeURIComponent(tab.url)}`;
  chrome.tabs.create({ url: translatedUrl, index: tab.index + 1 });
}

const IMAGE_EXTENSION = /\.(jpe?g|png|gif|webp|avif|svg|bmp|ico)$/i;

function getImageExtension(url) {
  const match = new URL(url).pathname.match(IMAGE_EXTENSION);
  return match ? match[0].toLowerCase() : ".jpg";
}

function handleImageDownload(tab, message) {
  const noSpaceTitle = tab.title.replace(/\s+/g, "");
  const trimmedTitle =
    noSpaceTitle.length > 15 ? `${noSpaceTitle.slice(0, 15)}...` : noSpaceTitle;
  const safeTitle = trimmedTitle.replace(/[^\p{L}\p{N}_\-()[\]]/gu, "_");

  const urls = message.urls.filter((url) => /^https?:\/\//.test(url));
  urls.forEach((url, index) => {
    chrome.downloads.download({
      url,
      filename: `${safeTitle}/image-${index + 1}${getImageExtension(url)}`,
      saveAs: false,
    });
  });
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

// 브라우저를 켤 때 못 보낸 클릭을 보내고 서버 설정을 가져온다
chrome.runtime.onStartup.addListener(() => {
  flushClicks()
    .catch((error) => console.error("Failed to flush clicks:", error))
    .finally(() =>
      syncFromServer().catch((error) =>
        console.error("Failed to sync from server:", error),
      ),
    );
});

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
const externalHandlers = {
  getSession: async () => {
    const { jwt } = await chrome.storage.local.get("jwt");
    return { token: jwt ?? null };
  },
  getState: async () => ({ data: await getState() }),
  updateSettings: async (message) => ({ data: await updateSettings(message) }),
  resetStats: async () => ({ data: await resetStats() }),
};

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  const action = message?.action;
  if (typeof action !== "string" || !Object.hasOwn(externalHandlers, action)) {
    return;
  }

  externalHandlers[action](message)
    .then(sendResponse)
    .catch((error) => sendResponse({ error: error.message }));
  return true;
});
