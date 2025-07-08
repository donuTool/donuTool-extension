chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && (tab.url.startsWith("http://") || tab.url.startsWith("https://"))) {
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

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "goToNextTab" || message.action === "goToPreviousTab") {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
        const currentIndex = activeTabs[0].index;
        if (message.action === "goToNextTab") {
          const nextIndex = (currentIndex + 1) % tabs.length;
          chrome.tabs.update(tabs[nextIndex].id, { active: true });
        } else if (message.action === "goToPreviousTab") {
          const previousIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          chrome.tabs.update(tabs[previousIndex].id, { active: true });
        }
      });
    });
  }

  if (message.action === "closeCurrentTab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.remove(tabs[0].id);
      }
    });
  }

  if (message.action === "bookmarkCurrentTab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.bookmarks.create({
        title: tab.title,
        url: tab.url,
      });

      chrome.tabs.sendMessage(tab.id, {
        action: "showBookmarkAlert",
        title: tab.title,
      });
    });
  }

  if (message.action === "copyCurrentTabAddress") {
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

  return true;
});
