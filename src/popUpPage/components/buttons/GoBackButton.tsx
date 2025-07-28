import { useNavigate } from "react-router-dom";
import GoBackIcon from "@/assets/arrow-left.svg?react";

export default function GoBackButton() {
  const navigate = useNavigate();

  const goBackToMainPage = () => {
    navigate("/main");
  };

  return (
    <button
      onClick={goBackToMainPage}
      className="dark:bg-donutool-button absolute top-3 right-3 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-2 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
    >
      <GoBackIcon className="dark:stroke-donutool-text h-4 w-4 stroke-neutral-600" />
    </button>
  );
}
