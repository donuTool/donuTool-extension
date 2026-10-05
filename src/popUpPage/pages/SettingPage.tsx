import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import type { Button } from "@/stores/types";
import { useThemeStore } from "@/stores/useThemeStore";
import { useButtonStore } from "@/stores/useButtonStore";
import { useAddressStore } from "@/stores/useAddressStore";
import { fetchUser, syncUserSettings } from "@/popUpPage/utils/userApi";
import GoBackButton from "@/popUpPage/components/buttons/GoBackButton";
import VirtualToolBar from "@/popUpPage/components/VirtualToolBar";
import ButtonsInList from "@/popUpPage/components/ButtonsInList";

export default function SettingPage() {
  const { t } = useTranslation();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { buttons, setButtons } = useButtonStore();
  const { address, setAddress } = useAddressStore();

  // 마운트 시에는 불러오기만 하고, 저장(storage + 서버)은 사용자가 변경했을 때만 한다
  useEffect(() => {
    chrome.storage?.local.get(
      ["buttonsSetting", "addressOfNewTab"],
      ({ buttonsSetting, addressOfNewTab }) => {
        if (buttonsSetting?.length) setButtons(buttonsSetting);
        if (addressOfNewTab) setAddress(addressOfNewTab);
      },
    );

    fetchUser()
      .then((serverUser) => {
        if (!serverUser) return;

        const fromServer: {
          buttonsSetting?: Button[];
          addressOfNewTab?: string;
        } = {};
        if (serverUser.buttonsSetting?.length) {
          fromServer.buttonsSetting = serverUser.buttonsSetting;
          setButtons(serverUser.buttonsSetting);
        }
        if (serverUser.addressOfNewTab) {
          fromServer.addressOfNewTab = serverUser.addressOfNewTab;
          setAddress(serverUser.addressOfNewTab);
        }
        chrome.storage?.local.set(fromServer);
      })
      .catch((err) =>
        console.error("Failed to fetch settings from server:", err),
      );
  }, [setButtons, setAddress]);

  const saveButtons = (newButtons: Button[]) => {
    setButtons(newButtons);
    chrome.storage?.local.set({ buttonsSetting: newButtons });
    syncUserSettings({ buttonsSetting: newButtons });
  };

  const saveAddress = (newAddress: string) => {
    setAddress(newAddress);
    chrome.storage?.local.set({ addressOfNewTab: newAddress });
    syncUserSettings({ addressOfNewTab: newAddress });
  };

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
      saveAddress(addressValue);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeIndex = buttons.findIndex((btn) => btn.id === activeId);
    const overIndex = buttons.findIndex((btn) => btn.id === overId);
    if (activeIndex < 0 || overIndex < 0) return;

    const activeButton = buttons[activeIndex];
    const overButton = buttons[overIndex];
    const newButtons = [...buttons];
    newButtons[activeIndex] = {
      ...activeButton,
      id: overButton.id,
      image: overButton.image,
    };
    newButtons[overIndex] = {
      ...overButton,
      id: activeButton.id,
      image: activeButton.image,
    };

    saveButtons(newButtons);
  };

  return (
    <>
      <GoBackButton />
      <div className="dark:text-donutool-text mb-7 text-2xl font-bold text-neutral-600 transition duration-300 select-none">
        {t("setting")}
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="mb-10 flex items-center justify-center gap-5">
          <VirtualToolBar />
          <ButtonsInList />
        </div>
      </DndContext>
      <input
        className="dark:bg-donutool-button dark:text-donutool-text my-2 h-7 w-45 rounded-lg bg-neutral-100 text-center transition-all duration-300 placeholder:text-center focus:outline-none"
        placeholder={t("typeAddress")}
        onKeyDown={setAddressOfNewTab}
      />
      <div className="dark:text-donutool-text text-neutral-500 transition duration-300 select-none">
        {t("currentTabAddress")} :{" "}
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
