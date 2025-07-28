import { useTranslation } from "react-i18next";

export default function StartButton() {
  const { t } = useTranslation();

  const addToolBarUI = () => {
    chrome.storage.local.get("donuToolActive", async (data) => {
      if (!data.donuToolActive) {
        const tabs = await chrome.tabs.query({});
        tabs.forEach((tab) => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            files: ["overlay/injectToolBarUI.js"],
          });
          chrome.tabs.sendMessage(tab.id!, { action: "addToolbar" });
        });
        chrome.storage.local.set({ donuToolActive: true });
      }
      return;
    });
  };

  return (
    <button
      onClick={addToolBarUI}
      className="dark:bg-donutool-button dark:text-donutool-text absolute top-3 left-3 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
    >
      {t("start")}
    </button>
  );
}
