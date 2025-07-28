import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function GoToOptionButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToSettingPage = () => {
    navigate("/setting");
  };

  return (
    <button
      onClick={navigateToSettingPage}
      className="dark:bg-donutool-button dark:text-donutool-text absolute top-3 right-3 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow transition duration-300 hover:shadow-md"
    >
      {t("setting")}
    </button>
  );
}
