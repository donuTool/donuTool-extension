import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";
import SunIcon from "@/assets/sun.svg?react";
import MoonIcon from "@/assets/moon.svg?react";

export default function ThemeToggleButton() {
  const { isDarkMode, setIsDarkMode } = useThemeStore();

  useEffect(() => {
    chrome.storage?.local.get(["user"], (data) => {
      if (data.user) {
        const googleId = data.user.googleId;

        fetch(`http://localhost:3001/api/user/${googleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isDarkMode: isDarkMode }),
        }).catch((err) =>
          console.error("Failed to update buttonsSetting to server:", err),
        );
      }
    });

    chrome.storage?.local.set({ isDarkMode: !isDarkMode });
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
