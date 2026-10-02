import { useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/Button/Button";
import { ContextMenu } from "@/shared/ui/ContextMenu/ContextMenu";
import { useApplicationStore } from "@/entities/application/store/ApplicationStoreProvider";
import type {
  Application,
  CreatableApplicationType,
} from "@/entities/application";
import { findApplication, getShortcutScope } from "@/entities/application";
import { useTranslations } from "next-intl";
import { ShortcutGrid } from "../../../../../entities/shortcuts/ui/ShortcutGrid";
import { CreateApplication } from "../../modals/CreateApplication/CreateApplication";
import { RenameApplication } from "../../modals/RenameApplication/RenameApplication";

type ExplorerProps = {
  application: Extract<Application, { type: "explorer" }>;
};

export const Explorer = ({ application }: ExplorerProps) => {
  const applications = useApplicationStore((store) => store.applications);
  const openApplication = useApplicationStore((store) => store.openApplication);
  const shortcutPositions = useApplicationStore((store) => store.shortcutPositions);
  const moveShortcut = useApplicationStore((store) => store.moveShortcut);

  const t = useTranslations("ui");
  const [path, setPath] = useState<number[]>([]);
  const [createType, setCreateType] = useState<CreatableApplicationType | null>(
    null,
  );
  const [fileMenu, setFileMenu] = useState(false);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const current = path.length
    ? findApplication(applications, path[path.length - 1])
    : application;

  const handleFileMenu = () => setFileMenu((value) => !value);
  const handleCreateFolder = () => {
    setCreateType("explorer");
    setFileMenu(false);
  };
  const handleCreateDocument = () => {
    setCreateType("notebook");
    setFileMenu(false);
  };
  const handleCreateExecutable = () => {
    setCreateType("execute");
    setFileMenu(false);
  };

  const handleCloseCreate = () => setCreateType(null);
  const handleUp = () => setPath(path.slice(0, -1));
  const handleHelp = () => window.alert(t("helpText"));

  const handleBlankContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    setFileMenu(false);
    setContextMenu({ x: event.clientX, y: event.clientY });
  };
  const handleCloseContextMenu = () => setContextMenu(null);
  const handleRename = (id: number) => setRenamingId(id);
  const handleCloseRename = () => setRenamingId(null);
  const handleMoveShortcut = (id: number, slot: number) => {
    if (current?.type === "explorer") moveShortcut(id, slot, current.id);
  };

  const handleOpen = (item: Application) => {
    if (item.type === "explorer") {
      setPath([...path, item.id]);
      return;
    }
    openApplication(item.id);
  };

  if (!current || current.type !== "explorer") return null;

  const scope = getShortcutScope(current.id);
  const renamedApplication = current.applications.find(
    (item) => item.id === renamingId,
  );

  const address = [
    "C:",
    "Portfolio",
    application.label,
    ...path.map((id) => findApplication(applications, id)?.label),
  ].join("\\");

  return (
    <div className="flex min-h-0 flex-1 flex-col p-2">
      <div className="relative mb-3 flex h-8 shrink-0 items-center gap-5 border-b border-[#808080] px-1">
        <button
          aria-expanded={fileMenu}
          className="hover:bg-secondary hover:text-white"
          onClick={handleFileMenu}
        >
          {t("file")}
        </button>
        <span className="text-[#808080]">{t("edit")}</span>
        <span className="text-[#808080]">{t("view")}</span>
        <button onClick={handleHelp}>{t("help")}</button>
        {fileMenu && (
          <div className="absolute top-8 left-0 z-10 w-64 border border-black bg-background-window p-1 shadow-md">
            <button
              className="block w-full p-2 text-left hover:bg-secondary hover:text-white"
              onClick={handleCreateFolder}
            >
              {t("createFolder")}
            </button>
            <button
              className="block w-full p-2 text-left hover:bg-secondary hover:text-white"
              onClick={handleCreateDocument}
            >
              {t("createDocument")}
            </button>
            <button
              className="block w-full p-2 text-left hover:bg-secondary hover:text-white"
              onClick={handleCreateExecutable}
            >
              {t("createApplication")}
            </button>
          </div>
        )}
      </div>
      <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2">
        <Button
          className="min-h-8 text-base"
          disabled={!path.length}
          onClick={handleUp}
        >
          ← {t("back")}
        </Button>
        <Button
          className="min-h-8 text-base"
          disabled={!path.length}
          onClick={handleUp}
        >
          ↑ {t("up")}
        </Button>
        <label className="flex min-w-36 flex-1 items-center gap-3">
          {t("address")}
          <input
            aria-label={t("address")}
            readOnly
            value={address}
            className="min-w-0 flex-1 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white px-2 py-1"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-auto border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="min-h-full"
        >
          <ShortcutGrid
            applications={current.applications}
            scope={scope}
            positions={shortcutPositions[scope]}
            darkLabel
            className="min-h-full p-3 md:p-8"
            onOpen={handleOpen}
            onRename={handleRename}
            onMove={handleMoveShortcut}
            onBlankContextMenu={handleBlankContextMenu}
          />
          {!current.applications.length && (
            <p className="p-5 text-[#808080]">{t("emptyFolder")}</p>
          )}
        </motion.div>
      </div>
      <p className="py-2 text-[#666]">{t("openHint")}</p>
      <footer className="shrink-0 border border-t-[#808080] border-l-[#808080] border-r-white border-b-white px-2 py-1">
        {current.applications.length} {t("objects")}
      </footer>
      <ContextMenu
        position={contextMenu}
        actions={[
          { label: t("createFolder"), onSelect: handleCreateFolder },
          { label: t("createDocument"), onSelect: handleCreateDocument },
          { label: t("createApplication"), onSelect: handleCreateExecutable },
        ]}
        onClose={handleCloseContextMenu}
      />
      {createType && (
        <CreateApplication
          type={createType}
          parentId={current.id}
          onClose={handleCloseCreate}
        />
      )}
      {renamedApplication && (
        <RenameApplication
          application={renamedApplication}
          onClose={handleCloseRename}
        />
      )}
    </div>
  );
};
