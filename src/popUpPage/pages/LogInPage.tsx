import { useNavigate } from "react-router-dom";
import { googleLogin } from "@/auth/googleLogin";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle } from "react-icons/bs";
import { useButtonStore } from "@/stores/useButtonStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAddressStore } from "@/stores/useAddressStore";
import Title from "@/popUpPage/components/Title";
import LoginButton from "@/popUpPage/components/buttons/LogInButton";

export default function LogInPage() {
  const navigate = useNavigate();
  const setButtons = useButtonStore((state) => state.setButtons);
  const setIsDarkMode = useThemeStore((state) => state.setIsDarkMode);
  const setAddress = useAddressStore((state) => state.setAddress);

  const logInWithGoogle = async () => {
    try {
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
            return;
          }
          navigate("/main");
        },
      );

      setButtons(data.user.buttonsSetting);
      setIsDarkMode(data.user.isDarkMode);
      setAddress(data.user.addressOfNewTab);
    } catch (e) {
      alert(`Error: 로그인 실패 ${e}`);
    }
  };

  const goToMainPage = () => {
    chrome.storage?.local.set({ user: "guest" }, () => {
      navigate("/main");
    });
  };

  return (
    <>
      <Title />
      <LoginButton
        onClick={logInWithGoogle}
        icon={<FcGoogle className="absolute left-3 h-4 w-4" />}
        label="Google로 로그인"
        extraClassName="mt-2 pr-2"
      />
      <div className="dark:bg-donutool-text my-2.5 h-[0.5px] w-38 bg-neutral-400"></div>
      <LoginButton
        onClick={goToMainPage}
        icon={<BsPersonCircle className="absolute left-3 h-4 w-4" />}
        label="Guest로 로그인"
      />
    </>
  );
}
