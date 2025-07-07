import { Button } from "@/store/types";
import DroppableArea from "@/popUpPage/utils/DroppableArea";
import DraggableButton from "@/popUpPage/utils/DraggableButton";

export default function ButtonsInList({ buttons }: { buttons: Button[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {buttons
        .filter((b) => b.status === "IN_LIST")
        .map((button) => (
          <DroppableArea key={button.id} id={button.id}>
            <DraggableButton button={button} />
          </DroppableArea>
        ))}
    </div>
  );
}
