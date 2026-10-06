import { t, trimTitle } from "@/shared/messages";

const CONFIRM_IMAGE_COUNT = 20;

const sendToBackground = (action) => () => chrome.runtime.sendMessage({ action });

function collectImageUrls() {
  const urls = Array.from(document.images, (img) => img.currentSrc || img.src);
  return [...new Set(urls)].filter((url) => /^https?:\/\//.test(url));
}

// ui: { showAlert, setToolbarHidden }
export const buttonActions = {
  goBack: () => window.history.go(-1),
  goForward: () => window.history.go(1),
  reload: () => location.reload(),
  newTab: sendToBackground("openNewTab"),
  moveToNextTab: sendToBackground("goToNextTab"),
  moveToPrevTab: sendToBackground("goToPreviousTab"),
  close: sendToBackground("closeCurrentTab"),
  bookmark: sendToBackground("bookmarkCurrentTab"),
  bookmark2: sendToBackground("bookmarkCurrentTab"),
  translate: sendToBackground("openTranslatedPage"),
  capture: sendToBackground("captureVisibleTab"),
  downloadImages: (ui) => {
    const urls = collectImageUrls();
    if (urls.length === 0) {
      ui.showAlert(t("noImages"));
      return;
    }
    if (
      urls.length > CONFIRM_IMAGE_COUNT &&
      !window.confirm(t("confirmManyImages", { count: urls.length }))
    ) {
      return;
    }

    chrome.runtime.sendMessage({ action: "downloadImages", urls });
    ui.showAlert(t("imagesDownloading", { count: urls.length }));
  },
  copyTabAddress: (ui) => {
    navigator.clipboard
      .writeText(location.href)
      .then(() =>
        ui.showAlert(t("addressCopied", { title: trimTitle(document.title) })),
      )
      .catch(() => ui.showAlert(t("addressCopyFailed")));
  },
  print: (ui) => {
    ui.setToolbarHidden(true);
    window.print();
    ui.setToolbarHidden(false);
  },
};
