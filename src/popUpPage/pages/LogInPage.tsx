import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { googleLogin } from "@/auth/googleLogin";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle } from "react-icons/bs";
import { useButtonStore } from "@/stores/useButtonStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAddressStore } from "@/stores/useAddressStore";
import Title from "@/popUpPage/components/Title";
import LoginButton from "@/popUpPage/components/buttons/LogInButton";

export default function LogInPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setButtons = useButtonStore((state) => state.setButtons);
  const setIsDarkMode = useThemeStore((state) => state.setIsDarkMode);
  const setAddress = useAddressStore((state) => state.setAddress);
  const [isLoading, setIsLoading] = useState(false);

  const logInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const data = await googleLogin({ prompt: "select_account" });
      chrome.storage?.local.set(
        {
          jwt: data.token,
          user: data.user,
          buttonsSetting: data.user.buttonsSetting,
          isDarkMode: data.user.isDarkMode,
          addressOfNewTab: data.user.addressOfNewTab,
        },
        () => {
          if (chrome.runtime.lastError) {
            alert(`Storage error: ${chrome.runtime.lastError.message}`);
            setIsLoading(false);
            return;
          }
          navigate("/main");
          chrome.tabs.create({
            url: `http://localhost:5173?googleId=${data.user.googleId}`,
          });
        },
      );

      setButtons(data.user.buttonsSetting);
      setIsDarkMode(data.user.isDarkMode);
      setAddress(data.user.addressOfNewTab);
      setIsLoading(false);
    } catch (e) {
      alert(`Error: 로그인 실패 ${e}`);
      setIsLoading(false);
    }
  };

  const goToMainPage = () => {
    chrome.storage?.local.set({ user: "guest" }, () => {
      navigate("/main");
      chrome.tabs.create({ url: "http://localhost:5173" });
    });
  };

  return (
    <>
      <Title />
      {isLoading ? (
        <div className="flex h-[84.5px] items-center justify-center space-x-1">
          <div className="animate-loader dark:bg-donutool-text h-7 w-1.5 bg-neutral-600" />
          <div className="animate-loader animation-delay-150 dark:bg-donutool-text h-7 w-1.5 bg-neutral-600" />
          <div className="animate-loader animation-delay-300 dark:bg-donutool-text h-7 w-1.5 bg-neutral-600" />
          <div className="animate-loader animation-delay-450 dark:bg-donutool-text h-7 w-1.5 bg-neutral-600" />
        </div>
      ) : (
        <div>
          <LoginButton
            onClick={logInWithGoogle}
            icon={<FcGoogle className="absolute left-3 h-4 w-4" />}
            label={t("loginWithGoogle")}
            extraClassName="pr-2"
          />
          <div className="dark:bg-donutool-text my-2.5 h-[0.5px] w-38 bg-neutral-400"></div>
          <LoginButton
            onClick={goToMainPage}
            icon={<BsPersonCircle className="absolute left-3 h-4 w-4" />}
            label={t("loginWithGuestMode")}
          />
        </div>
      )}
    </>
  );
}
