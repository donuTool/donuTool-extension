import { useNavigate } from "react-router-dom";
import { googleLogin } from "@/auth/googleLogin";
import Title from "@/popUpPage//components/Title";

export default function LogInPage() {
  const navigate = useNavigate();

  const logInWithGoogle = async () => {
    try {
      const data = await googleLogin({ prompt: "select_account" });
      chrome.storage?.local.set({ jwt: data.token, user: data.user }, () => {
        if (chrome.runtime.lastError) {
          alert(`Storage error: ${chrome.runtime.lastError.message}`);
          return;
        }
        navigate("/main");
      });
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
      <button
        onClick={logInWithGoogle}
        className="dark:bg-donutool-button dark:text-donutool-text mt-4 flex w-30 cursor-pointer items-center justify-center rounded-full bg-gray-100 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
      >
        로그인
      </button>
      <div className="dark:bg-donutool-text my-3 h-px w-30 bg-neutral-400"></div>
      <button
        onClick={goToMainPage}
        className="dark:bg-donutool-button dark:text-donutool-text flex w-30 cursor-pointer items-center justify-center rounded-full bg-gray-100 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
      >
        게스트
      </button>
    </>
  );
}
