import { Button } from "@/store/types";
import DroppableArea from "@/popUpPage/utils/DroppableArea";
import DraggableButton from "@/popUpPage/utils/DraggableButton";

export default function ButtonsInList({ buttons }: { buttons: Button[] }) {
  return (
    <DroppableArea id={`list`}>
      <div className="grid grid-cols-3 gap-2">
        {buttons
          .filter((b) => b.status === "IN_LIST")
          .map((button) => (
            <DraggableButton key={button.id} button={button} />
          ))}
      </div>
    </DroppableArea>
  );
}
