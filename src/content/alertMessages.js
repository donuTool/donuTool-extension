import { t, trimTitle } from "@/shared/messages";

// background에서 보낸 메시지에 대해 띄울 알림 문구
export const alertMessages = {
  showBookmarkAlert: (message) =>
    t("bookmarkDone", { title: trimTitle(message.title) }),
  downloadCapturedImage: (message) => {
    const link = document.createElement("a");
    link.href = message.dataUrl;
    link.download = `[${trimTitle(message.title)}].png`;
    link.click();

    return t("captureDone");
  },
};
