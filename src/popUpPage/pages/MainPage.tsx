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
      <div className="flex w-full items-center justify-center pt-3 text-xs">
        <div className="dark:text-donutool-text space-y-3 text-sm font-semibold text-neutral-600 transition duration-300 select-none">
          <div className="flex">
            <span className="flex-shrink-0 text-right">1.</span>
            <span className="pl-2 whitespace-pre-line">
              {
                "앱 창의 왼쪽 상단의 초록색 버튼을 눌러 전체\n화면을 시작해주세요."
              }
            </span>
          </div>
          <div className="flex">
            <span className="flex-shrink-0 text-right">2.</span>
            <span className="pl-2 whitespace-pre-line">
              {
                '화면 최상단 메뉴 바에서 보기 탭을 클릭한 뒤,\n"전체화면에서 항상 툴바 표시 항목"을 꺼주세요.'
              }
            </span>
          </div>
          <div className="flex">
            <span className="flex-shrink-0 text-right">3.</span>
            <span className="pl-2 whitespace-pre-line">
              {
                "확장프로그램 좌상단의 시작 버튼을 눌러\ndonuTool 사용을 시작하세요!"
              }
            </span>
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
