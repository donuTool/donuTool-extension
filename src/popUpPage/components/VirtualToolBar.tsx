import { useButtonStore } from "@/stores/useButtonStore";
import donuToolBar from "@/assets/donuToolBar.png";
import DroppableArea from "@/popUpPage/utils/DroppableArea";
import DraggableButton from "@/popUpPage/utils/DraggableButton";

export default function VirtualToolBar() {
  const buttons = useButtonStore((state) => state.buttons);

  return (
    <div className="relative">
      <img
        src={donuToolBar}
        draggable={false}
        className="h-[150px] w-[150px] brightness-[1.15]"
      />
      {buttons
        .filter((button) => button.status === "IN_TOOLBAR")
        .map((button) => (
          <DroppableArea
            key={button.id}
            id={button.id}
            style={{
              position: "absolute",
              top: `${button.top}px`,
              left: `${button.left}px`,
              width: "33.3px",
              height: "33.3px",
            }}
          >
            <DraggableButton button={button} />
          </DroppableArea>
        ))}
    </div>
  );
}
