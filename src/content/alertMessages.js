export const trimTitle = (title) =>
  title.length > 15 ? title.slice(0, 15) + "..." : title;

// background에서 보낸 메시지에 대해 띄울 알림 문구
export const alertMessages = {
  showBookmarkAlert: (message) =>
    `${trimTitle(message.title)} 페이지 북마크 완료`,
  noImagesAvailable: () => "다운로드할 이미지가 없음",
  imagesDownloadSuccess: () => "이미지 다운로드 성공",
  downloadCapturedImage: (message) => {
    const link = document.createElement("a");
    link.href = message.dataUrl;
    link.download = `[${trimTitle(message.title)}].png`;
    link.click();

    return "페이지 캡쳐 성공";
  },
};
