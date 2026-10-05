import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/useThemeStore";
import { useButtonStore } from "@/stores/useButtonStore";
import { fetchUser } from "@/popUpPage/utils/userApi";
import Background from "@/popUpPage/components/Background";
import LogInPage from "@/popUpPage/pages/LogInPage";
import MainPage from "@/popUpPage/pages/MainPage";
import SettingPage from "@/popUpPage/pages/SettingPage";
import ThemeToggleButton from "@/popUpPage/components/buttons/ThemeToggleButton";

function App() {
  const setIsDarkMode = useThemeStore((state) => state.setIsDarkMode);
  const { buttons, setButtons } = useButtonStore();

  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage?.local.get(["buttonsSetting"], (result) => {
      if (result.buttonsSetting && result.buttonsSetting.length > 0) {
        setButtons(result.buttonsSetting);
      } else {
        fetchUser()
          .then((serverUser) => {
            const serverButtons = serverUser?.buttonsSetting;
            if (serverButtons && serverButtons.length > 0) {
              setButtons(serverButtons);
              chrome.storage?.local.set({ buttonsSetting: serverButtons });
            } else {
              chrome.storage?.local.set({ buttonsSetting: buttons });
            }
          })
          .catch((err) => {
            console.error("Failed to fetch user from server:", err);
            chrome.storage?.local.set({ buttonsSetting: buttons });
          });
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage?.local.get("isDarkMode", (result) => {
      if (typeof result.isDarkMode === "boolean") {
        setIsDarkMode(result.isDarkMode);
      } else {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(media.matches);
        chrome.storage?.local.set({ isDarkMode: media.matches });
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
