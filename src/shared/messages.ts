// content script/background에서 쓰는 문구 (팝업은 react-i18next 사용)
const messages = {
  ko: {
    bookmarkDone: "{title} 페이지 북마크 완료",
    bookmarkFolder: "donuTool 북마크 폴더",
    addressCopied: "{title} 페이지 주소 복사 완료",
    addressCopyFailed: "주소 복사 실패",
    noImages: "다운로드할 이미지가 없음",
    confirmManyImages: "이미지 {count}개를 모두 다운로드할까요?",
    imagesDownloading: "이미지 {count}개 다운로드 시작",
    captureDone: "페이지 캡쳐 성공",
    toolbarEnabled: "툴바 활성화됨",
    toolbarDisabled: "툴바 일시 비활성화됨",
  },
  en: {
    bookmarkDone: "Bookmarked {title}",
    bookmarkFolder: "donuTool Bookmarks",
    addressCopied: "Copied the address of {title}",
    addressCopyFailed: "Failed to copy the address",
    noImages: "No images to download",
    confirmManyImages: "Download all {count} images?",
    imagesDownloading: "Downloading {count} images",
    captureDone: "Page captured",
    toolbarEnabled: "Toolbar enabled",
    toolbarDisabled: "Toolbar temporarily disabled",
  },
};

type MessageKey = keyof (typeof messages)["ko"];

export const uiLanguage = chrome.i18n.getUILanguage();
const locale = uiLanguage.startsWith("ko") ? "ko" : "en";

export function t(key: MessageKey, params: Record<string, string | number> = {}) {
  return messages[locale][key].replace(/\{(\w+)\}/g, (_, name) =>
    String(params[name] ?? ""),
  );
}

export const trimTitle = (title: string) =>
  title.length > 15 ? title.slice(0, 15) + "..." : title;
