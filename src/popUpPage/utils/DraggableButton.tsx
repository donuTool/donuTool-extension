import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/store/types";

export default function DraggableButton({ button }: { button: Button }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: button.id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    top: button.status === "IN_TOOLBAR" ? `${button.top}px` : undefined,
    left: button.status === "IN_TOOLBAR" ? `${button.left}px` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="w-[33.3px] h-[33.3px] bg-neutral-300 text-xs font-light text-neutral-600 rounded-full flex items-center justify-center cursor-pointer shadow">
      <img src={chrome.runtime?.getURL(`assets/${button.image}.svg`)} className="block w-[20.8px] h-[20.8px]" />
    </div>
  );
}
