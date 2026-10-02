import type { MouseEvent } from "react";
import type { Application } from "@/entities/application";
import { ApplicationShortcut } from "./ApplicationShortcut";

type ShortcutCellProps = {
  application: Application;
  scope: string;
  darkLabel?: boolean;
  selected: boolean;
  onOpen: (application: Application) => void;
  onSelect: (id: number) => void;
  onMenu: (id: number, event: MouseEvent<HTMLButtonElement>) => void;
  onRename: (id: number) => void;
};

export function ShortcutCell({
  application,
  scope,
  darkLabel,
  selected,
  onOpen,
  onSelect,
  onMenu,
  onRename,
}: ShortcutCellProps) {
  const handleOpen = () => onOpen(application);
  const handleSelect = () => onSelect(application.id);
  const handleRename = () => onRename(application.id);
  const handleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    onMenu(application.id, event);
  };

  return (
    <ApplicationShortcut
      name={application.label}
      icon={application.icon}
      layoutId={`${scope}-${application.id}`}
      onOpen={handleOpen}
      onSelect={handleSelect}
      onRename={handleRename}
      onContextMenu={handleMenu}
      isSelected={selected}
      darkLabel={darkLabel}
    />
  );
}
