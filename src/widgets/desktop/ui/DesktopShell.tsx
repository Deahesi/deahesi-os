"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import { useApplicationStore } from "@/features/applications";
import { BootScreen } from "./BootScreen";
import { Desktop } from "./Desktop";
import { Taskbar } from "../../taskbar/ui/Taskbar";

export const DesktopShell = () => {
  const hydrated = useApplicationStore((store) => store.hydrated);
  const reducedMotion = useReducedMotion();
  const [minimumElapsed, setMinimumElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setMinimumElapsed(true),
      reducedMotion ? 200 : 1600,
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-dvh flex-col overflow-hidden">
        <Desktop />
        <Taskbar />
      </div>
      <AnimatePresence>
        {(!hydrated || !minimumElapsed) && <BootScreen />}
      </AnimatePresence>
    </MotionConfig>
  );
};
