import Title from "@/popUpPage//components/Title";
import StartButton from "@/popUpPage/components/buttons/StartButton";
import StopButton from "@/popUpPage/components/buttons/StopButton";
import GoToOptionButton from "@/popUpPage/components/buttons/GoToOptionButton";
import LogOutButton from "@/popUpPage/components/buttons/LogOutButton";
import { useTranslation } from "react-i18next";

export default function MainPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title />
      <div className="flex w-full items-center justify-center pt-3 text-xs">
        <div className="dark:text-donutool-text space-y-3 text-sm font-semibold text-neutral-600 transition duration-300 select-none">
          <div className="flex">
            <span className="flex-shrink-0 text-right">1.</span>
            <span className="pl-2 whitespace-pre-line">{t("startGuide1")}</span>
          </div>
          <div className="flex">
            <span className="flex-shrink-0 text-right">2.</span>
            <span className="pl-2 whitespace-pre-line">{t("startGuide2")}</span>
          </div>
          <div className="flex">
            <span className="flex-shrink-0 text-right">3.</span>
            <span className="pl-2 whitespace-pre-line">{t("startGuide3")}</span>
          </div>
        </div>
      </div>
      <div className="absolute top-3 left-3 flex flex-row gap-2">
        <StartButton />
        <StopButton />
      </div>
      <div className="absolute top-3 right-3 flex flex-row gap-2">
        <LogOutButton />
        <GoToOptionButton />
      </div>
    </>
  );
}
