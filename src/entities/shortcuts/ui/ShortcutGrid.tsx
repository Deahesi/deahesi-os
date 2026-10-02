"use client";

import { useState, type MouseEvent } from "react";
import { LayoutGroup } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Application } from "@/entities/application";
import { ContextMenu } from "@/shared/ui/ContextMenu/ContextMenu";
import { DraggableGrid } from "@/shared/ui/DraggableGrid/DraggableGrid";
import { ShortcutCell } from "./ShortcutCell";

type ShortcutGridProps = {
  applications: Application[];
  scope: string;
  positions?: Record<number, number>;
  darkLabel?: boolean;
  className?: string;
  onOpen: (application: Application) => void;
  onRename: (id: number) => void;
  onMove: (id: number, slot: number) => void;
  onBlankContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
};

export function ShortcutGrid({
  applications,
  scope,
  positions,
  darkLabel,
  className,
  onOpen,
  onRename,
  onMove,
  onBlankContextMenu,
}: ShortcutGridProps) {
  const t = useTranslations("ui");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [menu, setMenu] = useState<{ id: number; x: number; y: number } | null>(null);
  const menuApplication = applications.find((item) => item.id === menu?.id);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setMenu(null);
  };

  const handleMenu = (id: number, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(id);
    setMenu({ id, x: event.clientX, y: event.clientY });
  };

  const handleRename = (id: number) => {
    setMenu(null);
    onRename(id);
  };

  const handleBlankClick = () => {
    setSelectedId(null);
    setMenu(null);
  };

  const handleBlankContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    if (!onBlankContextMenu) return;

    event.preventDefault();
    setMenu(null);
    onBlankContextMenu(event);
  };

  const handleMenuOpen = () => {
    if (menuApplication) onOpen(menuApplication);
  };

  const handleMenuRename = () => {
    if (menuApplication) handleRename(menuApplication.id);
  };

  const renderShortcut = (application: Application) => (
    <ShortcutCell
      application={application}
      scope={scope}
      darkLabel={darkLabel}
      selected={selectedId === application.id}
      onOpen={onOpen}
      onSelect={handleSelect}
      onMenu={handleMenu}
      onRename={handleRename}
    />
  );

  return (
    <>
      <LayoutGroup id={scope}>
        <DraggableGrid
          items={applications}
          positions={positions}
          className={className}
          renderItem={renderShortcut}
          onMove={onMove}
          onDragStart={handleSelect}
          onBlankClick={handleBlankClick}
          onBlankContextMenu={handleBlankContextMenu}
        />
      </LayoutGroup>
      <ContextMenu
        position={menu && menuApplication ? menu : null}
        actions={[
          { label: t("open"), onSelect: handleMenuOpen },
          { label: t("rename"), onSelect: handleMenuRename },
        ]}
        onClose={() => setMenu(null)}
      />
    </>
  );
}
