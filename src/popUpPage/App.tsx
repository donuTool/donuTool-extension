import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useThemeStore } from "@/stores/useThemeStore";
import MainPage from "@/popUpPage/pages/MainPage";
import SettingPage from "@/popUpPage/pages/SettingPage";

function App() {
  const setIsDarkMode = useThemeStore((state) => state.setIsDarkMode);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateMode = () => {
      setIsDarkMode(media.matches);
      chrome.storage?.local.set({ isDarkMode: media.matches });
    };

    updateMode();
    media.addEventListener("change", updateMode);

    return () => media.removeEventListener("change", updateMode);
  }, []);

  return (
    <>
      <div className="dark:bg-donutool-bg absolute -z-50 h-[400px] w-[350px] bg-gray-300"></div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/setting" element={<SettingPage />} />
      </Routes>
    </>
  );
}

export default App;
