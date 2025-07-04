export default function SetFullscreenButton() {
  const setBrowserFullscreen = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "requestFullscreen" });
      }
    });
  };

  return (
    <button
      onClick={setBrowserFullscreen}
      className="font-semibold px-3.5 py-2 flex cursor-pointer items-center justify-center rounded-xl text-neutral-600 bg-gray-100 p-1 shadow transition duration-300 hover:shadow-md">
      전체화면
    </button>
  );
}
