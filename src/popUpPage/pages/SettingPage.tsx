import { useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Button } from "@/store/types";
import GoBackButton from "@/popUpPage/components/GoBackButton";
import VirtualToolBar from "@/popUpPage/components/VirtualToolBar";

const INITIAL_BUTTONS: Button[] = [
  { id: "1", title: "1", status: "IN_LIST" },
  { id: "2", title: "2", status: "IN_LIST" },
  { id: "3", title: "3", status: "IN_LIST" },
  { id: "4", title: "4", status: "IN_LIST" },
  { id: "5", title: "5", status: "IN_LIST" },
  { id: "6", title: "6", status: "IN_LIST" },
  { id: "7", title: "7", status: "IN_LIST" },
  { id: "8", title: "8", status: "IN_LIST" },
  { id: "9", title: "9", status: "IN_LIST" },
  { id: "a", title: "a", status: "IN_TOOLBAR", top: 15, left: 93.3 },
  { id: "b", title: "b", status: "IN_TOOLBAR", top: 53.3, left: 109.2 },
  { id: "c", title: "c", status: "IN_TOOLBAR", top: 93.3, left: 93.3 },
  { id: "d", title: "d", status: "IN_TOOLBAR", top: 109.2, left: 53.3 },
  { id: "e", title: "e", status: "IN_TOOLBAR", top: 92.5, left: 15.8 },
];

function DroppableArea({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="w-[35px] h-[35px] bg-neutral-200 rounded-full flex items-center justify-center shadow">
      {children}
    </div>
  );
}

function DraggableButton({ button }: { button: Button }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: button.id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="w-[35px] h-[35px] bg-neutral-300 text-xs font-light text-neutral-600 rounded-full flex items-center justify-center cursor-pointer">
      {button.title}
    </div>
  );
}

export default function SettingPage() {
  const [address, setAddress] = useState("");
  const [buttons, setButtons] = useState<Button[]>(INITIAL_BUTTONS);

  chrome.storage?.local.get("addressOfNewTab", (data) => {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const buttonId = active.id as string;

    const overId = String(over.id);
    const newStatus = overId.includes("toolbar") ? "IN_TOOLBAR" : overId.includes("list") ? "IN_LIST" : undefined;

    if (!newStatus) return;

    setButtons((prev) => prev.map((button) => (button.id === buttonId ? { ...button, status: newStatus } : button)));
  };

  return (
    <>
      <GoBackButton />
      <div className="text-2xl font-bold mb-7 text-neutral-600">설정</div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex justify-center items-center gap-5 mb-10">
          <VirtualToolBar buttons={buttons} />
          <div className="grid grid-cols-3 gap-2">
            {buttons
              .filter((b) => b.status === "IN_LIST")
              .map((button) => (
                <DroppableArea key={button.id} id={`slot-${button.id}`}>
                  <DraggableButton button={button} />
                </DroppableArea>
              ))}
          </div>
        </div>
      </DndContext>
      <input className="w-50 h-7 my-2 bg-white text-center placeholder:text-center rounded-lg" placeholder="변경할 주소를 입력하세요" onKeyDown={setAddressOfNewTab} />
      <div className="text-neutral-500">현재 주소 : {address}</div>
    </>
  );
}
