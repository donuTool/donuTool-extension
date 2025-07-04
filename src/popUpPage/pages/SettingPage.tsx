import GoBackButton from "@/popUpPage/components/GoBackButton";
import donuToolBar from "@/assets/donuToolBar.png";
import { useState } from "react";

export default function SettingPage() {
  const [address, setAddress] = useState("");

  chrome.storage.local.get("addressOfNewTab", (data) => {
    if (data.addressOfNewTab) {
      setAddress(data.addressOfNewTab);
    }
  });

  const setAddressOfNewTab = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      let addressValue = event.currentTarget.value;
      if (!/^https?:\/\//.test(addressValue)) {
        addressValue = "https://" + addressValue;
      }
      chrome.storage.local.set({ addressOfNewTab: addressValue });
      setAddress(addressValue);
    }
  };

  return (
    <>
      <GoBackButton />
      <div className="text-2xl font-bold mb-7 text-gray-600">설정</div>
      <div className="flex justify-center items-center gap-5 mb-7">
        <img src={donuToolBar} className="w-[150px] h-[150px] brightness-[1.15]" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center bg-neutral-300 shadow w-[35px] h-[35px] rounded-full text-xs font-light text-neutral-500 cursor-pointer">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <input className="w-50 h-7 mb-2 bg-white text-center placeholder:text-center" placeholder="변경할 주소를 입력하세요" onKeyDown={setAddressOfNewTab} />
      <div className="text-neutral-500">현재 주소 : {address}</div>
    </>
  );
}
