import Title from "@/popUpPage//components/Title";
import StartButton from "@/popUpPage/components/buttons/StartButton";
import StopButton from "@/popUpPage/components/buttons/StopButton";
import GoToOptionButton from "@/popUpPage/components/buttons/GoToOptionButton";
import LogOutButton from "@/popUpPage/components/buttons/LogOutButton";
import OSGuide from "@/popUpPage/components/OSGuide";
import { useTranslation } from "react-i18next";

export default function MainPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title />
      <div className="flex w-full flex-col items-center justify-center text-xs">
        <OSGuide
          osName="Mac"
          steps={[
            t("startGuideForMac1"),
            t("startGuideForMac2"),
            t("startGuideForMac3"),
          ]}
        />
        <OSGuide
          osName="Windows"
          steps={[t("startGuideForWindows1"), t("startGuideForWindows2")]}
        />
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
