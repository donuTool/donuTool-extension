import SetFullscreenButton from "@/popUpPage/components/SetFullscreenButton";
import StartButton from "@/popUpPage/components/StartButton";
import StopButton from "@/popUpPage/components/StopButton";
import GoToOptionButton from "@/popUpPage/components/GoToOptionButton";

export default function MainPage() {
  function Title() {
    return <h2 className="text-3xl mb-4 font-black text-neutral-600">DonuTool</h2>;
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
