import { useNavigate } from "react-router-dom";

export default function GoToOptionButton() {
  const navigate = useNavigate();

  const navigateToSettingPage = () => {
    navigate("/setting");
  };

  return (
    <button
      onClick={navigateToSettingPage}
      className="font-semibold absolute top-3 text-xs right-3 px-3.5 py-2 flex cursor-pointer items-center justify-center rounded-full text-neutral-600 bg-gray-100 p-1 shadow transition duration-300 hover:shadow-md">
      설정
    </button>
  );
}
