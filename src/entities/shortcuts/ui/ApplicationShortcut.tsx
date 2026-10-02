import { cn } from "cn";
import Image from "next/image";
import { motion } from "framer-motion";
import type { KeyboardEvent, MouseEvent } from "react";
import { useTranslations } from "next-intl";

type ApplicationShortcutProps = {
  name: string;
  icon: string;
  layoutId: string;
  onOpen: () => void;
  onSelect: () => void;
  onRename: () => void;
  onContextMenu: (event: MouseEvent<HTMLButtonElement>) => void;
  isSelected: boolean;
  darkLabel?: boolean;
  disabled?: boolean;
};

export const ApplicationShortcut = ({
  name,
  icon,
  layoutId,
  onOpen,
  onSelect,
  onRename,
  onContextMenu,
  isSelected,
  darkLabel,
  disabled,
}: ApplicationShortcutProps) => {
  const t = useTranslations("ui");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!disabled) onOpen();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "F2") {
      event.preventDefault();
      onRename();
    } else if (event.key === "Enter" && !disabled) {
      onOpen();
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="h-36 w-36"
    >
      <button
        type="button"
        draggable
        aria-disabled={disabled}
        title={disabled ? t("disabled") : name}
        className="flex h-36 w-36 cursor-default flex-col items-center gap-3 p-3 focus-visible:outline-dotted"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={onContextMenu}
      >
        <span className="relative h-23 w-28 shrink-0">
          <Image
            className="object-contain [image-rendering:pixelated]"
            sizes="112px"
            fill
            src={icon}
            alt=""
            draggable={false}
          />
          {isSelected && (
            <span
              className="absolute inset-0 bg-blue-600 mix-blend-color"
              style={{
                maskImage: `url("${icon}")`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            />
          )}
        </span>
        <span
          className={cn(
            "text-nowrap text-ellipsis line-clamp-2 max-w-full break-words px-1 text-center text-base leading-5 text-white",
            darkLabel && "text-black",
            isSelected &&
              "bg-secondary text-white outline outline-dotted outline-white/70",
          )}
        >
          {name}
        </span>
      </button>
    </motion.div>
  );
};
