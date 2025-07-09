import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/stores/types";

export default function DraggableButton({ button }: { button: Button }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: button.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    top: button.status === "IN_TOOLBAR" ? `${button.top}px` : undefined,
    left: button.status === "IN_TOOLBAR" ? `${button.left}px` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="flex h-[33.3px] w-[33.3px] cursor-pointer items-center justify-center rounded-full bg-neutral-300 text-xs font-light text-neutral-600 shadow"
    >
      <img
        src={chrome.runtime?.getURL(`assets/${button.image}.svg`)}
        className="block h-[20.8px] w-[20.8px]"
      />
    </div>
  );
}
