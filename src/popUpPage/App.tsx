import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/useThemeStore";
import Background from "@/popUpPage/components/Background";
import LogInPage from "@/popUpPage/pages/LogInPage";
import MainPage from "@/popUpPage/pages/MainPage";
import SettingPage from "@/popUpPage/pages/SettingPage";
import ThemeToggleButton from "@/popUpPage/components/buttons/ThemeToggleButton";

function App() {
  const setIsDarkMode = useThemeStore((state) => state.setIsDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage?.local.get("isDarkMode", (result) => {
      if (typeof result.isDarkMode === "boolean") {
        setIsDarkMode(result.isDarkMode);
      } else {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const updateMode = () => {
          setIsDarkMode(media.matches);
          chrome.storage?.local.set({ isDarkMode: media.matches });
        };
        updateMode();
        media.addEventListener("change", updateMode);
        return () => media.removeEventListener("change", updateMode);
      }
    });

    chrome.storage?.local.get("user", (result) => {
      if (result.user) {
        navigate("/main");
      }
    });
  }, []);

  return (
    <>
      <Background />
      <ThemeToggleButton />
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/setting" element={<SettingPage />} />
      </Routes>
    </>
  );
}

export default App;
