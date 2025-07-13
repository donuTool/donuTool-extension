import { useButtonStore } from "@/stores/useButtonStore";
import DroppableArea from "@/popUpPage/utils/DroppableArea";
import DraggableButton from "@/popUpPage/utils/DraggableButton";

export default function ButtonsInList() {
  const buttons = useButtonStore((state) => state.buttons);

  return (
    <div className="grid grid-cols-3 gap-2">
      {buttons
        .filter((button) => button.status === "IN_LIST")
        .map((button) => (
          <DroppableArea key={button.id} id={button.id}>
            <DraggableButton button={button} />
          </DroppableArea>
        ))}
    </div>
  );
}
