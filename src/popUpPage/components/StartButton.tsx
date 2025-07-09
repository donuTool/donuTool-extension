export default function StartButton() {
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
      className="font-semibold absolute top-3 text-xs left-3 px-3.5 py-2 flex cursor-pointer items-center justify-center rounded-full text-neutral-600 bg-gray-100 p-1 shadow transition duration-300 hover:shadow-md">
      시작
    </button>
  );
}
