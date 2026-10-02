import type { Application } from "@/entities/application";
import { SETTINGS_APPLICATION_ID } from "@/entities/application";
import { aboutApp } from "./bundled-applications";

export const initialApplications: Application[] = [
  {
    id: 1,
    name: "explorer",
    label: "Front-end",
    type: "explorer",
    icon: "/folder.svg",
    state: "standby",
    applications: [aboutApp],
  },
  {
    id: SETTINGS_APPLICATION_ID,
    name: "settings",
    label: "Settings",
    type: "settings",
    icon: "/settings.svg",
    state: "standby",
  },
];
