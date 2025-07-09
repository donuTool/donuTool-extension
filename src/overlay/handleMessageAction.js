export const handleMessageAction = {
  showBookmarkAlert: (message) => {
    return `${trimTitle(message.title)} 페이지 북마크 완료`;
  },
  showClipboardCopyAlert: (message) => {
    return `${trimTitle(message.title)} 페이지 주소 복사 완료`;
  },
  noImagesAvailable: () => {
    return "다운로드할 이미지가 없음";
  },
  imagesDownloadSuccess: () => {
    return "이미지 다운로드 성공";
  },
  downloadCapturedImage: (message) => {
    const link = document.createElement("a");
    link.href = message.dataUrl;
    link.download = `[${trimTitle(message.title)}].png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return "페이지 캡쳐 성공";
  },
  requestFullscreen: () => {
    document.documentElement.requestFullscreen();

    return "전체화면";
  },
  addToolbar: () => {
    return "툴바 활성화됨";
  },
  removeToolbar: () => {
    document.getElementById("donuTool-toolBar")?.remove();

    return "툴바 비활성화됨";
  },
};

export const trimTitle = (title) => (title.length > 15 ? title.slice(0, 15) + "..." : title);
