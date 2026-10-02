import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type PropsWithChildren,
} from "react";
import { cn } from "cn";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/Button/Button";
import { useTranslations } from "next-intl";

type ApplicationLayoutProps = {
  name: string;
  onClose: () => void;
  onCollapse: () => void;
  onFocus: () => void;
  active: boolean;
  collapsed: boolean;
  large?: boolean;
  order: number;
};

type Position = { x: number; y: number };
type Size = { width: number; height: number };
type ResizeDirection = "right" | "bottom" | "corner";

type DragStart = {
  pointerX: number;
  pointerY: number;
  x: number;
  y: number;
  baseLeft: number;
  baseTop: number;
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
};

type ResizeStart = {
  pointerX: number;
  pointerY: number;
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
  direction: ResizeDirection;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

export const ApplicationLayout = ({
  name,
  children,
  onClose,
  onCollapse,
  onFocus,
  active,
  collapsed,
  large,
  order,
}: PropsWithChildren<ApplicationLayoutProps>) => {
  const windowRef = useRef<HTMLElement>(null);
  const drag = useRef<DragStart | null>(null);
  const resize = useRef<ResizeStart | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size | null>(null);
  const t = useTranslations();

  const handleMaximize = () => setMaximized((value) => !value);

  const handleTitleButtonsDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleTitlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (maximized || (event.target as HTMLElement).closest("button")) return;
    const rect = windowRef.current!.getBoundingClientRect();
    const container = windowRef.current!.parentElement!.getBoundingClientRect();
    drag.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
      baseLeft: rect.left - position.x - container.left,
      baseTop: rect.top - position.y - container.top,
      width: rect.width,
      height: rect.height,
      containerWidth: container.width,
      containerHeight: container.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTitlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const start = drag.current;
    if (!start) return;
    setPosition({
      x: clamp(
        start.x + event.clientX - start.pointerX,
        -start.baseLeft,
        start.containerWidth - start.baseLeft - start.width,
      ),
      y: clamp(
        start.y + event.clientY - start.pointerY,
        -start.baseTop,
        start.containerHeight - start.baseTop - start.height,
      ),
    });
  };

  const handleTitlePointerUp = () => {
    drag.current = null;
  };

  const handleResizePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (maximized) return;
    event.preventDefault();
    const rect = windowRef.current!.getBoundingClientRect();
    const container = windowRef.current!.parentElement!.getBoundingClientRect();
    resize.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: rect.width,
      height: rect.height,
      maxWidth: container.right - rect.left,
      maxHeight: container.bottom - rect.top,
      direction: event.currentTarget.dataset.direction as ResizeDirection,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleResizePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = resize.current;
    if (!start) return;
    setSize({
      width:
        start.direction === "bottom"
          ? start.width
          : clamp(
              start.width + event.clientX - start.pointerX,
              Math.min(320, start.maxWidth),
              start.maxWidth,
            ),
      height:
        start.direction === "right"
          ? start.height
          : clamp(
              start.height + event.clientY - start.pointerY,
              Math.min(240, start.maxHeight),
              start.maxHeight,
            ),
    });
  };

  const handleResizePointerUp = () => {
    resize.current = null;
  };

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const offset = {
      ArrowRight: { width: 16, height: 0 },
      ArrowLeft: { width: -16, height: 0 },
      ArrowDown: { width: 0, height: 16 },
      ArrowUp: { width: 0, height: -16 },
    }[event.key];
    if (!offset || maximized) return;
    event.preventDefault();
    const rect = windowRef.current!.getBoundingClientRect();
    const container = windowRef.current!.parentElement!.getBoundingClientRect();
    setSize({
      width: clamp(
        rect.width + offset.width,
        Math.min(320, container.right - rect.left),
        container.right - rect.left,
      ),
      height: clamp(
        rect.height + offset.height,
        Math.min(240, container.bottom - rect.top),
        container.bottom - rect.top,
      ),
    });
  };

  return (
    <motion.section
      ref={windowRef}
      aria-label={name}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onPointerDownCapture={onFocus}
      className={cn(
        "absolute left-2 top-3 flex h-[calc(100%-24px)] w-[calc(100%-16px)] min-h-0 flex-col overflow-hidden border-2 border-t-white border-l-white border-r-black border-b-black bg-background-window p-1 shadow-[inset_-1px_-1px_0_#808080]",
        large
          ? "md:left-6 md:top-5 md:h-[calc(100%-40px)] md:w-[calc(100%-48px)]"
          : "md:left-[5.7%] md:top-[7%] md:h-[87%] md:w-[88.6%]",
        maximized && "left-0! top-0! h-full! w-full!",
      )}
      style={{
        zIndex: order + 1,
        display: collapsed ? "none" : undefined,
        width: maximized ? undefined : size?.width,
        height: maximized ? undefined : size?.height,
        transform: maximized
          ? undefined
          : `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <header
        className={cn(
          "flex h-8 shrink-0 touch-none items-center justify-between gap-2 px-1 text-white select-none",
          active ? "bg-secondary" : "bg-[#808080]",
        )}
        onDoubleClick={handleMaximize}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onLostPointerCapture={handleTitlePointerUp}
      >
        <h2 className="truncate pl-1 text-lg">{name}</h2>
        <div
          className="flex gap-1"
          onDoubleClick={handleTitleButtonsDoubleClick}
        >
          <Button
            className="min-h-6 w-7 px-0 py-0 text-base"
            aria-label={t("ui.minimize")}
            onClick={onCollapse}
          >
            _
          </Button>
          <Button
            className="min-h-6 w-7 px-0 py-0 text-base"
            aria-label={maximized ? t("ui.restore") : t("ui.maximize")}
            onClick={handleMaximize}
          >
            □
          </Button>
          <Button
            className="min-h-6 w-7 px-0 py-0 text-base"
            aria-label={t("ui.close")}
            onClick={onClose}
          >
            ×
          </Button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        {children}
      </div>
      {!maximized && (
        <>
          <div
            data-direction="right"
            className="absolute top-8 right-0 bottom-4 w-1 cursor-ew-resize touch-none"
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            onLostPointerCapture={handleResizePointerUp}
          />
          <div
            data-direction="bottom"
            className="absolute right-4 bottom-0 left-0 h-1 cursor-ns-resize touch-none"
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            onLostPointerCapture={handleResizePointerUp}
          />
          <div
            role="separator"
            tabIndex={0}
            aria-label={t("ui.resize")}
            aria-orientation="horizontal"
            data-direction="corner"
            className="absolute right-0 bottom-0 flex size-4 cursor-nwse-resize touch-none items-end justify-end text-xs leading-none text-[#666] focus-visible:outline"
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            onLostPointerCapture={handleResizePointerUp}
            onKeyDown={handleResizeKeyDown}
          >
            ◢
          </div>
        </>
      )}
    </motion.section>
  );
};

