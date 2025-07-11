import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/useThemeStore";
import MainPage from "@/popUpPage/pages/MainPage";
import SettingPage from "@/popUpPage/pages/SettingPage";
import { googleLogin } from "@/auth/googleLogin";

function App() {
  const { isDarkMode, setIsDarkMode } = useThemeStore();

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

  useEffect(() => {
    chrome.storage?.local.get("user", (result) => {
      if (result.user) {
        navigate("/main");
      }
    });
  }, []);

  const navigate = useNavigate();

  const logInWithGoogle = async () => {
    try {
      const data = await googleLogin();
      console.log("Logged in: ", data.user);
      chrome.storage?.local.set({ user: data.user });
      navigate("/main");
    } catch (e) {
      console.error(e);
    }
  };

  const goToMainPage = () => {
    chrome.storage?.local.set({ user: "guest" }, () => {
      navigate("/main");
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    chrome.storage?.local.set({ isDarkMode: !isDarkMode });
  };

  return (
    <>
      <div className="dark:bg-donutool-bg absolute -z-50 h-[400px] w-[350px] bg-gray-300 transition duration-300"></div>
      <button
        onClick={toggleTheme}
        className="dark:bg-donutool-button dark:text-donutool-text absolute right-3 bottom-3 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
      >
        {isDarkMode ? "Light" : "Dark"}
      </button>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h2 className="dark:text-donutool-text mb-4 text-3xl font-black text-neutral-600 transition duration-300 select-none">
                DonuTool
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={logInWithGoogle}
                  className="dark:bg-donutool-button dark:text-donutool-text flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
                >
                  로그인
                </button>
                <button
                  onClick={goToMainPage}
                  className="dark:bg-donutool-button dark:text-donutool-text flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
                >
                  게스트
                </button>
              </div>
            </>
          }
        />
        <Route path="/main" element={<MainPage />} />
        <Route path="/setting" element={<SettingPage />} />
      </Routes>
    </>
  );
}

export default App;
