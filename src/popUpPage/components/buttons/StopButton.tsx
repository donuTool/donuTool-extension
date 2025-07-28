import { useTranslation } from "react-i18next";

export default function StopButton() {
  const { t } = useTranslation();

  const removeToolBarUI = async () => {
    const tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id!, { action: "removeToolbar" });
    });
    chrome.storage.local.set({ donuToolActive: false });
  };

  return (
    <button
      onClick={removeToolBarUI}
      className="dark:bg-donutool-button absolute top-3 left-17 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-red-400 shadow transition duration-300 hover:shadow-md"
    >
      {t("stop")}
    </button>
  );
}
