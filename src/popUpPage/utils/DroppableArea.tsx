import { useDroppable } from "@dnd-kit/core";

export default function DroppableArea({ id, children, style }: { id: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
