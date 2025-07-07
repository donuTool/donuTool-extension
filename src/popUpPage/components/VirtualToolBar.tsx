import donuToolBar from "@/assets/donuToolBar.png";
import { Button } from "@/store/types";
import { useDraggable } from "@dnd-kit/core";

function DraggableButton({ button }: { button: Button }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: button.id,
  });

  const style = {
    top: `${button.top}px`,
    left: `${button.left}px`,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="absolute flex w-[33.3px] h-[33.3px] rounded-full justify-center items-center bg-neutral-300 cursor-pointer" style={style}>
      {button.title}
    </div>
  );
}

export default function VirtualToolBar({ buttons }: { buttons: Button[] }) {
  return (
    <div className="relative">
      <img src={donuToolBar} className="w-[150px] h-[150px] brightness-[1.15]" />
      {buttons
        .filter((button) => button.status === "IN_TOOLBAR")
        .map((button) => (
          <DraggableButton key={button.id} button={button} />
        ))}
    </div>
  );
}
