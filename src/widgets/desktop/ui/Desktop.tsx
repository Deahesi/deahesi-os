"use client";

import { useState, type MouseEvent } from "react";
import { AnimatePresence } from "framer-motion";
import {
  CreateApplication,
  RenameApplication,
  useApplicationStore,
} from "@/features/applications";
import {
  getOpenApplications,
  getShortcutScope,
  SETTINGS_APPLICATION_ID,
  type Application,
  type CreatableApplicationType,
} from "@/entities/application";
import { ContextMenu } from "@/shared/ui/ContextMenu/ContextMenu";
import { useTranslations } from "next-intl";
import { DesktopWindow } from "./DesktopWindow";
import { ShortcutGrid } from "../../../entities/shortcuts/ui/ShortcutGrid";

export const Desktop = () => {
  const applications = useApplicationStore((store) => store.applications);

  const openApplication = useApplicationStore((store) => store.openApplication);
  const shortcutPositions = useApplicationStore(
    (store) => store.shortcutPositions,
  );
  const moveShortcut = useApplicationStore((store) => store.moveShortcut);
  const t = useTranslations("ui");
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [createType, setCreateType] = useState<CreatableApplicationType | null>(
    null,
  );
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const scope = getShortcutScope();
  const renamedApplication = applications.find(
    (application) => application.id === renamingId,
  );
  const openApplications = getOpenApplications(applications);
  const activeId = openApplications.findLast(
    (application) => application.state === "opened",
  )?.id;

  const handleOpen = (application: Application) => {
    openApplication(application.id);
  };

  const handleBlankContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    setMenu({ x: event.clientX, y: event.clientY });
  };

  const handleDesktopClick = () => setMenu(null);
  const handleCreateFolder = () => {
    setCreateType("explorer");
    setMenu(null);
  };

  const handleCreateApplication = () => {
    setCreateType("execute");
    setMenu(null);
  };

  const handleCreateDocument = () => {
    setCreateType("notebook");
    setMenu(null);
  };

  const handleCloseCreate = () => setCreateType(null);
  const handleRename = (id: number) => setRenamingId(id);
  const handleCloseRename = () => setRenamingId(null);
  const handleMoveShortcut = (id: number, slot: number) => {
    moveShortcut(id, slot);
  };
  const handleOpenSettings = () => openApplication(SETTINGS_APPLICATION_ID);
  const handleCloseMenu = () => setMenu(null);

  return (
    <main
      className="relative min-h-0 flex-1 overflow-hidden bg-background"
      onClick={handleDesktopClick}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pl-[24%] text-[#007171] select-none"
      >
        <p className="text-[clamp(36px,5.2vw,74px)] leading-none">DEAHESI OS</p>
        <p className="mt-5 tracking-widest">PORTFOLIO ENVIRONMENT</p>
      </div>
      <ShortcutGrid
        applications={applications.filter(
          (application) => application.type !== "settings",
        )}
        scope={scope}
        positions={shortcutPositions[scope]}
        className="absolute inset-0 overflow-auto p-4 md:px-12 md:py-10"
        onOpen={handleOpen}
        onRename={handleRename}
        onMove={handleMoveShortcut}
        onBlankContextMenu={handleBlankContextMenu}
      />
      {renamedApplication && (
        <RenameApplication
          application={renamedApplication}
          onClose={handleCloseRename}
        />
      )}
      <AnimatePresence initial={false}>
        {openApplications.map((application, order) => (
          <DesktopWindow
            key={application.id}
            application={application}
            active={activeId === application.id}
            order={order}
          />
        ))}
      </AnimatePresence>
      <ContextMenu
        position={menu}
        actions={[
          { label: t("createFolder"), onSelect: handleCreateFolder },
          { label: t("new-execute"), onSelect: handleCreateApplication },
          { label: t("createDocument"), onSelect: handleCreateDocument },
          { label: t("settings"), onSelect: handleOpenSettings },
        ]}
        onClose={handleCloseMenu}
      />
      {createType && (
        <CreateApplication type={createType} onClose={handleCloseCreate} />
      )}
    </main>
  );
};
