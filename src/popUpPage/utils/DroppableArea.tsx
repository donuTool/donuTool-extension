import { useDroppable } from "@dnd-kit/core";

export default function DroppableArea({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="w-[35px] h-[35px] bg-neutral-200 rounded-full flex items-center justify-center shadow">
      {children}
    </div>
  );
}
