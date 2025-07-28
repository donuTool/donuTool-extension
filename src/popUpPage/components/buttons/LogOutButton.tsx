import { useNavigate } from "react-router-dom";
import LogOutIcon from "@/assets/log-out.svg?react";

export default function LogOutButton() {
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
    <button
      onClick={logOutWithGoogle}
      className="dark:bg-donutool-button dark:text-donutool-text flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-2 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
    >
      <LogOutIcon className="dark:stroke-donutool-text h-4 w-4 stroke-neutral-600" />
    </button>
  );
}
