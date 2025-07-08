export const buttonActions = {
  "goBack": () => {
    window.history.go(-1);
  },
  "goForward": () => {
    window.history.go(1);
  },
  "newTab": () => {
    chrome.storage.local.get("addressOfNewTab", (data) => {
      const target = data.addressOfNewTab || "https://www.google.com";
      window.open(target, "_blank");
    });
  },
  "moveToNextTab": () => {
    chrome.runtime.sendMessage({ action: "goToNextTab" });
  },
  "moveToPrevTab": () => {
    chrome.runtime.sendMessage({ action: "goToPreviousTab" });
  },
  "reload": () => {
    location.reload();
  },
  "close": () => {
    chrome.runtime.sendMessage({ action: "closeCurrentTab" });
  },
  "bookmark": () => {
    chrome.runtime.sendMessage({ action: "bookmarkCurrentTab" });
  },
  "bookmark2": () => {
    chrome.runtime.sendMessage({ action: "bookmarkCurrentTab" });
  },
  "copyTabAddress": () => {
    chrome.runtime.sendMessage({ action: "copyCurrentTabAddress" });
  },
  "print": () => {
    chrome.runtime.sendMessage({ action: "printCurrentPage" });
  },
  "translate": () => alert("translate"),
  "downloadImages": () => alert("downloadImages"),
  "developer": () => alert("developer"),
};
