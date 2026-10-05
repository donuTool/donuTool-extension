import { trimTitle } from "./alertMessages.js";

const sendToBackground = (action) => () => chrome.runtime.sendMessage({ action });

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
  downloadImages: sendToBackground("downloadImagesFromCurrentPage"),
  capture: sendToBackground("captureVisibleTab"),
  copyTabAddress: (ui) => {
    navigator.clipboard
      .writeText(location.href)
      .then(() => ui.showAlert(`${trimTitle(document.title)} 페이지 주소 복사 완료`))
      .catch(() => ui.showAlert("주소 복사 실패"));
  },
  print: (ui) => {
    ui.setToolbarHidden(true);
    window.print();
    ui.setToolbarHidden(false);
  },
};
