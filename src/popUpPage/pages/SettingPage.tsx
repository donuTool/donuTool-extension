import { useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useThemeStore } from "@/stores/useThemeStore";
import { useButtonStore } from "@/stores/useButtonStore";
import GoBackButton from "@/popUpPage/components/GoBackButton";
import VirtualToolBar from "@/popUpPage/components/VirtualToolBar";
import ButtonsInList from "@/popUpPage/components/ButtonsInList";

export default function SettingPage() {
  const [address, setAddress] = useState("https://google.com");
  const { buttons, setButtons } = useButtonStore();

  const isDarkMode = useThemeStore((state) => state.isDarkMode);

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
        if (isDarkMode) {
          inputElement.classList.remove("dark:bg-donutool-button");
          inputElement.classList.add("bg-red-400", "animate-shake");
        } else {
          inputElement.classList.remove("bg-neutral-100");
          inputElement.classList.add("bg-red-100", "animate-shake");
        }

        setTimeout(() => {
          inputElement.classList.remove("animate-shake");
        }, 400);
        setTimeout(() => {
          if (isDarkMode) {
            inputElement.classList.remove("bg-red-400");
            inputElement.classList.add("dark:bg-donutool-button");
          } else {
            inputElement.classList.remove("bg-red-100");
            inputElement.classList.add("bg-neutral-100");
          }
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
      const temp = {
        id: newButtons[activeIndex].id,
        image: newButtons[activeIndex].image,
      };
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
      <div className="dark:text-donutool-text mb-7 text-2xl font-bold text-neutral-600 transition duration-300 select-none">
        설정
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="mb-10 flex items-center justify-center gap-5">
          <VirtualToolBar />
          <ButtonsInList />
        </div>
      </DndContext>
      <input
        className="dark:bg-donutool-button dark:text-donutool-text my-2 h-7 w-45 rounded-lg bg-neutral-100 text-center transition-all duration-300 placeholder:text-center focus:outline-none"
        placeholder="변경할 주소를 입력하세요"
        onKeyDown={setAddressOfNewTab}
      />
      <div className="dark:text-donutool-text text-neutral-500 transition duration-300 select-none">
        현재 주소 :{" "}
        <a
          href={address}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block max-w-[120px] truncate align-bottom underline"
        >
          {address}
        </a>
      </div>
    </>
  );
}
