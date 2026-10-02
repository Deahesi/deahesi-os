import { useEffect, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ContextMenuItem } from "./ContextMenuItem";

export type ContextMenuPosition = { x: number; y: number };

export type ContextMenuAction = {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
};

type ContextMenuProps = {
  position: ContextMenuPosition | null;
  actions: ContextMenuAction[];
  onClose: () => void;
};

export const ContextMenu = ({ position, actions, onClose }: ContextMenuProps) => {
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) onClose();
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [position, onClose]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
        'button[role="menuitem"]:not(:disabled)',
      ),
    ];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
      items.length;
    items[next]?.focus();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {position && (
        <motion.div
          key="context-menu"
          ref={menu}
          role="menu"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          className="fixed z-[50000] w-56 border-2 border-t-white border-l-white border-r-black border-b-black bg-background-window p-1 shadow-lg"
          style={{
            left: Math.max(4, Math.min(position.x, window.innerWidth - 228)),
            top: Math.max(
              4,
              Math.min(position.y, window.innerHeight - actions.length * 40 - 12),
            ),
          }}
          onKeyDown={handleKeyDown}
        >
          {actions.map((action, index) => (
            <ContextMenuItem
              key={action.label}
              action={action}
              autoFocus={index === 0}
              onClose={onClose}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
