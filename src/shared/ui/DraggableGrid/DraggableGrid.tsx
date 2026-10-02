"use client";

import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "cn";
import { getGridSlots } from "@/shared/lib/get-grid-slots";

type DraggableGridProps<T extends { id: number }> = {
  items: readonly T[];
  positions?: Record<number, number>;
  cellSize?: number;
  gap?: number;
  className?: string;
  renderItem: (item: T) => ReactNode;
  onMove: (id: number, slot: number) => void;
  onDragStart?: (id: number) => void;
  onBlankClick?: () => void;
  onBlankContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
};

export function DraggableGrid<T extends { id: number }>({
  items,
  positions,
  cellSize = 144,
  gap = 16,
  className,
  renderItem,
  onMove,
  onDragStart,
  onBlankClick,
  onBlankContextMenu,
}: DraggableGridProps<T>) {
  const grid = useRef<HTMLDivElement>(null);
  const draggedId = useRef<number | null>(null);
  const [size, setSize] = useState({ width: cellSize, height: cellSize });
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const slots = getGridSlots(items, positions);
  const columns = Math.max(1, Math.floor((size.width + gap) / (cellSize + gap)));
  const rows = Math.max(1, Math.floor((size.height + gap) / (cellSize + gap)));
  const slotCount = Math.max(
    columns * rows,
    ...[...slots.keys()].map((slot) => slot + 1),
    items.length,
  );

  useEffect(() => {
    if (!grid.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(grid.current);
    return () => observer.disconnect();
  }, []);

  const handleDragStart = (id: number, event: DragEvent<HTMLDivElement>) => {
    draggedId.current = id;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(id));
    onDragStart?.(id);
  };

  const handleDragEnd = () => {
    draggedId.current = null;
    setHoveredSlot(null);
  };

  const handleDragOver = (slot: number, event: DragEvent<HTMLDivElement>) => {
    if (draggedId.current === null) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setHoveredSlot(slot);
  };

  const handleDrop = (slot: number, event: DragEvent<HTMLDivElement>) => {
    if (draggedId.current === null) return;

    event.preventDefault();
    onMove(draggedId.current, slot);
    handleDragEnd();
  };

  return (
    <div
      ref={grid}
      className={cn("grid content-start justify-start", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
        gap,
      }}
      onClick={onBlankClick}
      onContextMenu={onBlankContextMenu}
    >
      {Array.from({ length: slotCount }, (_, slot) => {
        const item = slots.get(slot);

        return (
          <div
            key={slot}
            data-grid-slot={slot}
            className={cn(
              hoveredSlot === slot && "outline-2 outline-dashed outline-white/70",
            )}
            style={{ width: cellSize, height: cellSize }}
            onDragStart={item ? (event) => handleDragStart(item.id, event) : undefined}
            onDragEnd={handleDragEnd}
            onDragOver={(event) => handleDragOver(slot, event)}
            onDrop={(event) => handleDrop(slot, event)}
          >
            {item && renderItem(item)}
          </div>
        );
      })}
    </div>
  );
}
