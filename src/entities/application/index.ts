export type {
  Application,
  ApplicationState,
  CreatableApplicationType,
  ExecuteSrc,
} from "./model/application";
export { SETTINGS_APPLICATION_ID } from "./constants/settings";
export { findApplication, getApplications, getOpenApplications } from "./utils/application-utils";
export { getShortcutScope, getShortcutSlots } from "./utils/shortcut-grid";
export type { ShortcutPositions } from "./utils/shortcut-grid";
export { ApplicationShortcut } from "../shortcuts/ui/ApplicationShortcut";
