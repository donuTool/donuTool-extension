import { useNavigate } from "react-router-dom";

export default function GoBackButton() {
  const navigate = useNavigate();

  const goBackToMainPage = () => {
    navigate("/main");
  };

  return (
    <button
      onClick={goBackToMainPage}
      className="dark:bg-donutool-button dark:text-donutool-text absolute top-3 right-3 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
    >
      뒤로가기
    </button>
  );
}
