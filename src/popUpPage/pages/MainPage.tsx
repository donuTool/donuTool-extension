import Title from "@/popUpPage//components/Title";
import SetFullscreenButton from "@/popUpPage/components/buttons/SetFullscreenButton";
import StartButton from "@/popUpPage/components/buttons/StartButton";
import StopButton from "@/popUpPage/components/buttons/StopButton";
import GoToOptionButton from "@/popUpPage/components/buttons/GoToOptionButton";
import LogOutButton from "@/popUpPage/components/buttons/LogOutButton";

export default function MainPage() {
  return (
    <>
      <Title />
      <SetFullscreenButton />
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
