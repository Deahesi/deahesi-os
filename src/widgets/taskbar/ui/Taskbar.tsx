"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";
import { Button } from "@/shared/ui/Button/Button";
import { StartIcon } from "@/shared/ui/StartIcon/StartIcon";
import {
  CreateApplication,
  useApplicationStore,
} from "@/features/applications";
import {
  getOpenApplications,
  SETTINGS_APPLICATION_ID,
  type CreatableApplicationType,
} from "@/entities/application";
import { useLocale, useTranslations } from "next-intl";
import { TaskbarWindowButton } from "./TaskbarWindowButton";
import { StartMenu } from "./StartMenu";

export const Taskbar = () => {
  const applications = useApplicationStore((store) => store.applications);
  const openApplication = useApplicationStore((store) => store.openApplication);
  const language = useLocale();
  const t = useTranslations("ui");
  const [startOpen, setStartOpen] = useState(false);
  const [createType, setCreateType] = useState<CreatableApplicationType | null>(
    null,
  );
  const [time, setTime] = useState("");
  const menu = useRef<HTMLDivElement>(null);
  const openApplications = getOpenApplications(applications);
  const activeId = openApplications.findLast(
    (application) => application.state === "opened",
  )?.id;

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!startOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setStartOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStartOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [startOpen]);

  const handleStart = () => setStartOpen((value) => !value);

  const handleCloseCreate = () => setCreateType(null);

  const handleOpenSettings = () => {
    setStartOpen(false);
    openApplication(SETTINGS_APPLICATION_ID);
  };

  const handleCreate = (type: CreatableApplicationType) => {
    setStartOpen(false);
    setCreateType(type);
  };

  return (
    <footer className="relative z-20000 flex h-12 shrink-0 items-center gap-2 border-t-2 border-white bg-background-window px-1 py-1">
      <div ref={menu}>
        <Button
          aria-expanded={startOpen}
          aria-controls="start-menu"
          icon={<StartIcon />}
          className={cn(
            "min-h-9 text-xl",
            startOpen &&
              "border-t-[#404040] border-l-[#404040] border-r-white border-b-white",
          )}
          onClick={handleStart}
        >
          {t("start")}
        </Button>
        <StartMenu
          open={startOpen}
          onCreate={handleCreate}
          onSettingsOpen={handleOpenSettings}
        />
      </div>
      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {openApplications.map((application) => (
          <TaskbarWindowButton
            key={application.id}
            application={application}
            active={activeId === application.id}
          />
        ))}
      </div>
      <div className="flex h-9 shrink-0 items-center gap-4 border border-t-[#808080] border-l-[#808080] border-r-white border-b-white px-3">
        <span className="hidden sm:inline" aria-hidden="true">
          ▣
        </span>
        <span className="hidden sm:inline">{language.toUpperCase()}</span>
        <time className="min-w-10">{time || "--:--"}</time>
      </div>
      {createType && (
        <CreateApplication type={createType} onClose={handleCloseCreate} />
      )}
    </footer>
  );
};
