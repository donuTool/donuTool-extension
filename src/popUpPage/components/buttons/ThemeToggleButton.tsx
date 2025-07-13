import SunIcon from "@/assets/sun.svg?react";
import MoonIcon from "@/assets/moon.svg?react";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ThemeToggleButton() {
  const { isDarkMode, setIsDarkMode } = useThemeStore();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    chrome.storage?.local.set({ isDarkMode: !isDarkMode });
  };

  return (
    <button
      onClick={toggleTheme}
      className="dark:bg-donutool-button dark:text-donutool-text absolute right-3 bottom-3 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-2 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
    >
      {isDarkMode ? (
        <SunIcon className="stroke-donutool-text h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4 stroke-neutral-600" />
      )}
    </button>
  );
}
