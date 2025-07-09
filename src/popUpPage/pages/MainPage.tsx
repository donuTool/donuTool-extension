import SetFullscreenButton from "@/popUpPage/components/SetFullscreenButton";
import StartButton from "@/popUpPage/components/StartButton";
import StopButton from "@/popUpPage/components/StopButton";
import GoToOptionButton from "@/popUpPage/components/GoToOptionButton";

export default function MainPage() {
  function Title() {
    return (
      <h2 className="dark:text-donutool-200 mb-4 text-3xl font-black text-neutral-600">
        DonuTool
      </h2>
    );
  }

  return (
    <>
      <Title />
      <SetFullscreenButton />
      <StartButton />
      <StopButton />
      <GoToOptionButton />
    </>
  );
}
