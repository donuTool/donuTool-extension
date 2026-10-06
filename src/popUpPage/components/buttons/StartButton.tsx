import { useTranslation } from "react-i18next";

export default function StartButton() {
  const { t } = useTranslation();

  // 각 탭의 content script가 storage 변경을 감지해 툴바를 띄운다
  const addToolBarUI = () => {
    chrome.storage.local.set({ donuToolActive: true });
  };

  return (
    <button
      onClick={addToolBarUI}
      className="dark:bg-donutool-button dark:text-donutool-text flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
    >
      {t("start")}
    </button>
  );
}
