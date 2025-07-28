import { useNavigate } from "react-router-dom";
import SettingIcon from "@/assets/settings.svg?react";

export default function GoToOptionButton() {
  const navigate = useNavigate();

  const navigateToSettingPage = () => {
    navigate("/setting");
  };

  return (
    <button
      onClick={navigateToSettingPage}
      className="dark:bg-donutool-button dark:text-donutool-text flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-2 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
    >
      <SettingIcon className="dark:stroke-donutool-text h-4 w-4 stroke-neutral-600" />
    </button>
  );
}
