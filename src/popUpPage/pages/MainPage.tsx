import { useNavigate } from "react-router-dom";
import Title from "@/popUpPage//components/Title";
import SetFullscreenButton from "@/popUpPage/components/buttons/SetFullscreenButton";
import StartButton from "@/popUpPage/components/buttons/StartButton";
import StopButton from "@/popUpPage/components/buttons/StopButton";
import GoToOptionButton from "@/popUpPage/components/buttons/GoToOptionButton";

export default function MainPage() {
  const navigate = useNavigate();

  const logOutWithGoogle = () => {
    chrome.storage?.local.remove(
      [
        "buttonsSetting",
        "isDarkMode",
        "addressOfNewTab",
        "donuToolActive",
        "user",
        "jwt",
      ],
      () => {
        if (chrome.runtime.lastError) {
          alert(`Storage error: ${chrome.runtime.lastError.message}`);
          return;
        }
        navigate("/");
      },
    );
  };

  return (
    <>
      <Title />
      <SetFullscreenButton />
      <StartButton />
      <StopButton />
      <button
        onClick={logOutWithGoogle}
        className="dark:bg-donutool-button dark:text-donutool-text absolute top-3 right-17 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
      >
        로그아웃
      </button>
      <GoToOptionButton />
    </>
  );
}
