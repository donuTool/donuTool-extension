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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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

      const FOLDER_TITLE = "DonuTool 북마크 폴더";

      chrome.bookmarks.search({ title: FOLDER_TITLE }, (results) => {
        const folder = results.find((bookmarkNode) => bookmarkNode.title === FOLDER_TITLE && !bookmarkNode.url);
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

  if (message.action === "printCurrentPage") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          window.print();
        },
      });
    });
  }

  if (message.action === "openTranslatedPage") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const originalUrl = tabs[0].url;
      const translatedUrl = `https://translate.google.com/translate?sl=auto&tl=ko&u=${encodeURIComponent(originalUrl)}`;
      chrome.tabs.create({ url: translatedUrl });
    });
  }

  if (message.action === "downloadImagesFromCurrentPage") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const tabId = tab.id;
      const noSpaceTitle = tab.title.replace(/\s+/g, "");
      const trimmedTitle = noSpaceTitle.length > 15 ? `${noSpaceTitle.slice(0, 15)}...` : noSpaceTitle;
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
        }
      );
    });
  }

  return true;
});
