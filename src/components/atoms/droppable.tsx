import { useDroppable } from '@dnd-kit/core';

import { cn } from '@/lib/utils/cn';

export function Droppable({
  children,
  id,
  data,
}: {
  children: React.ReactNode;
  id: string;
  data?: any;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-all outline rounded-md outline-2 outline-transparent'
      )}
    >
      {children}
    </div>
  );
}
