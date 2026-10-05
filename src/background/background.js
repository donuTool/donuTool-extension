import { API_URL } from "../config.js";

let isCapturing = false;

const messageHandlers = {
  goToNextTab: handleTabSwitch,
  goToPreviousTab: handleTabSwitch,
  closeCurrentTab: handleCloseTab,
  bookmarkCurrentTab: handleBookmarkTab,
  copyCurrentTabAddress: handleCopyAddress,
  printCurrentPage: handlePrint,
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

function handleTabSwitch(message) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
      const currentIndex = activeTabs[0].index;
      const newIndex =
        message.action === "goToNextTab"
          ? (currentIndex + 1) % tabs.length
          : (currentIndex - 1 + tabs.length) % tabs.length;
      chrome.tabs.update(tabs[newIndex].id, { active: true });
    });
  });
}

function handleCloseTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.remove(tabs[0].id);
    }
  });
}

function handleBookmarkTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const FOLDER_TITLE = "donuTool 북마크 폴더";
    chrome.bookmarks.search({ title: FOLDER_TITLE }, (results) => {
      const folder = results.find(
        (bookmarkNode) =>
          bookmarkNode.title === FOLDER_TITLE && !bookmarkNode.url,
      );
      const parentId = folder?.id;
      const createBookmark = (parentId) => {
        chrome.bookmarks.create({
          parentId,
          title: tab.title,
          url: tab.url,
        });
        chrome.tabs.sendMessage(tab.id, {
          action: "showBookmarkAlert",
          title: tab.title,
        });
      };
      if (parentId) {
        createBookmark(parentId);
      } else {
        chrome.bookmarks.create({ title: FOLDER_TITLE }, (newFolder) => {
          createBookmark(newFolder.id);
        });
      }
    });
  });
}

function handleCopyAddress() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url;
    const tab = tabs[0];
    if (url) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (url) => {
          navigator.clipboard.writeText(url);
        },
        args: [url],
      });
      chrome.tabs.sendMessage(tab.id, {
        action: "showClipboardCopyAlert",
        title: tab.title,
      });
    }
  });
}

function handlePrint() {
  if (isCapturing) return;
  isCapturing = true;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const toolbar = document.getElementById("donuTool-toolBar");
          if (toolbar) toolbar.style.opacity = "0";
          const restoreOpacity = () => {
            const toolbar = document.getElementById("donuTool-toolBar");
            if (toolbar) toolbar.style.opacity = "";
            window.removeEventListener("afterprint", restoreOpacity);
          };
          window.addEventListener("afterprint", restoreOpacity);
          window.print();
        },
      },
      () => {
        isCapturing = false;
      },
    );
  });
}

function handleTranslate() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const originalUrl = tabs[0].url;
    const translatedUrl = `https://translate.google.com/translate?sl=auto&tl=ko&u=${encodeURIComponent(originalUrl)}`;
    chrome.tabs.create({ url: translatedUrl });
  });
}

function handleImageDownload() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const tabId = tab.id;
    const noSpaceTitle = tab.title.replace(/\s+/g, "");
    const trimmedTitle =
      noSpaceTitle.length > 15
        ? `${noSpaceTitle.slice(0, 15)}...`
        : noSpaceTitle;
    const safeTitle = trimmedTitle.replace(/[^\p{L}\p{N}_\-()\[\]]/gu, "_");
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const imageUrls = Array.from(document.querySelectorAll("img"))
            .map((img) => img.src)
            .filter((src) => src && !src.startsWith("data:"));
          return imageUrls;
        },
      },
      (injectionResults) => {
        const urls = injectionResults[0].result;
        if (!urls || urls.length === 0) {
          chrome.tabs.sendMessage(tab.id, {
            action: "noImagesAvailable",
          });
          return;
        }
        urls.forEach((url, index) => {
          chrome.downloads.download({
            url,
            filename: `${safeTitle}/image-${index + 1}.jpg`,
            saveAs: false,
          });
        });
        chrome.tabs.sendMessage(tab.id, {
          action: "imagesDownloadSuccess",
        });
      },
    );
  });
}

function handleCaptureTab() {
  if (isCapturing) return;
  isCapturing = true;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const toolbar = document.getElementById("donuTool-toolBar");
          if (toolbar) toolbar.style.opacity = "0";
        },
      },
      () => {
        setTimeout(() => {
          chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            chrome.scripting.executeScript({
              target: { tabId },
              func: () => {
                const toolbar = document.getElementById("donuTool-toolBar");
                if (toolbar) toolbar.style.opacity = "";
              },
            });
            chrome.tabs.sendMessage(tabId, {
              action: "downloadCapturedImage",
              dataUrl,
              title: tabs[0].title,
            });
            isCapturing = false;
          });
        }, 100);
      },
    );
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    (tab.url.startsWith("http://") || tab.url.startsWith("https://"))
  ) {
    chrome.storage.local.get("donuToolActive", (data) => {
      if (data.donuToolActive) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["overlay/injectToolBarUI.js"],
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const asyncHandler = asyncMessageHandlers[message.action];
  if (asyncHandler) {
    asyncHandler(message)
      .then((data) => sendResponse({ data }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }

  messageHandlers[message.action]?.(message, sender);
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
