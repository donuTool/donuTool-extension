import { useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Button } from "@/store/types";
import GoBackButton from "@/popUpPage/components/GoBackButton";
import VirtualToolBar from "@/popUpPage/components/VirtualToolBar";
import ButtonsInList from "@/popUpPage/components/ButtonsInList";

const INITIAL_BUTTONS: Button[] = [
  { id: "goBack", image: "arrow-left", status: "IN_TOOLBAR", top: 15, left: 93.3 },
  { id: "goForward", image: "arrow-right", status: "IN_TOOLBAR", top: 53.3, left: 109.2 },
  { id: "newTab", image: "new", status: "IN_TOOLBAR", top: 93.3, left: 93.3 },
  { id: "moveToNextTab", image: "arrow-right-to-line", status: "IN_TOOLBAR", top: 109.2, left: 53.3 },
  { id: "moveToPrevTab", image: "arrow-left-to-line", status: "IN_TOOLBAR", top: 92.5, left: 15.8 },
  { id: "reload", image: "rotate", status: "IN_LIST" },
  { id: "close", image: "close", status: "IN_LIST" },
  { id: "translate", image: "languages", status: "IN_LIST" },
  { id: "downloadImages", image: "image-down", status: "IN_LIST" },
  { id: "bookmark", image: "star", status: "IN_LIST" },
  { id: "bookmark2", image: "bookmark", status: "IN_LIST" },
  { id: "copyTabAddress", image: "clipboard-copy", status: "IN_LIST" },
  { id: "print", image: "printer", status: "IN_LIST" },
  { id: "capture", image: "camera", status: "IN_LIST" },
];

export default function SettingPage() {
  const [address, setAddress] = useState("https://google.com");
  const [buttons, setButtons] = useState<Button[]>(INITIAL_BUTTONS);

  useEffect(() => {
    chrome.storage?.local.get("buttonsSetting", (data) => {
      if (data.buttonsSetting) {
        setButtons(data.buttonsSetting);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage?.local.set({ buttonsSetting: buttons });
  }, [buttons]);

  chrome.storage?.local.get("addressOfNewTab", (data) => {
    if (data.addressOfNewTab) {
      setAddress(data.addressOfNewTab);
    }
  });

  const setAddressOfNewTab = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      let addressValue = event.currentTarget.value;
      const inputElement = event.currentTarget;

      const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(addressValue);
      const hasPeriod = /\./.test(addressValue);
      const hasBlankSpace = /\s/.test(addressValue);

      if (hasKorean || !hasPeriod || hasBlankSpace) {
        inputElement.classList.remove("bg-neutral-100");
        inputElement.classList.add("bg-red-100", "animate-shake");

        setTimeout(() => {
          inputElement.classList.remove("animate-shake");
        }, 400);
        setTimeout(() => {
          inputElement.classList.remove("bg-red-100");
          inputElement.classList.add("bg-neutral-100");
        }, 1000);
        return;
      }

      if (!/^https?:\/\//.test(addressValue)) {
        addressValue = "https://" + addressValue;
      }
      chrome.storage.local.set({ addressOfNewTab: addressValue });
      setAddress(addressValue);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setButtons((prev) => {
      const activeIndex = prev.findIndex((btn) => btn.id === activeId);
      const overIndex = prev.findIndex((btn) => btn.id === overId);

      if (activeIndex < 0 || overIndex < 0) return prev;

      const newButtons = [...prev];
      const temp = { id: newButtons[activeIndex].id, image: newButtons[activeIndex].image };
      newButtons[activeIndex].id = newButtons[overIndex].id;
      newButtons[activeIndex].image = newButtons[overIndex].image;
      newButtons[overIndex].id = temp.id;
      newButtons[overIndex].image = temp.image;

      return newButtons;
    });
  };

  return (
    <>
      <GoBackButton />
      <div className="text-2xl font-bold mb-7 text-neutral-600">설정</div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex justify-center items-center gap-5 mb-10">
          <VirtualToolBar buttons={buttons} />
          <ButtonsInList buttons={buttons} />
        </div>
      </DndContext>
      <input
        className="w-45 h-7 my-2 bg-neutral-100 text-center placeholder:text-center rounded-lg focus:outline-none transition-all"
        placeholder="변경할 주소를 입력하세요"
        onKeyDown={setAddressOfNewTab}
      />
      <div className="text-neutral-500">현재 주소 : {address}</div>
    </>
  );
}
