'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';

import { cn } from '@/lib/utils/cn';

export function Draggable({
  children,
  id,
  data,
}: {
  children: React.ReactNode;
  id: string;
  data?: any;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data,
    });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn({ 'opacity-50': isDragging })}
    >
      {children}
    </div>
  );
}
