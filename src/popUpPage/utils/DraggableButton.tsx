import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/store/types";

export default function DraggableButton({ button }: { button: Button }) {
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
