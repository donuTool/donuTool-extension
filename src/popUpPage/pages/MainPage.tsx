import { useNavigate } from "react-router-dom";
import SetFullscreenButton from "@/popUpPage/components/SetFullscreenButton";
import StartButton from "@/popUpPage/components/StartButton";
import StopButton from "@/popUpPage/components/StopButton";
import GoToOptionButton from "@/popUpPage/components/GoToOptionButton";

export default function MainPage() {
  function Title() {
    return (
      <h2 className="dark:text-donutool-text mb-4 text-3xl font-black text-neutral-600 transition duration-300 select-none">
        DonuTool
      </h2>
    );
  }

  const navigate = useNavigate();

  const logOutWithGoogle = () => {
    chrome.storage?.local.remove(["user", "jwt"], () => {
      if (chrome.runtime.lastError) {
        alert(`Storage error: ${chrome.runtime.lastError.message}`);
        return;
      }
      navigate("/");
    });
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
