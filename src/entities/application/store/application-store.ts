import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { Application, CreatableApplicationType } from "../model/application";
import { initialApplications } from "../constants/initial-applications";
import { createApplication } from "../../../features/applications/utils/create-application";
import { findApplication, getApplications } from "../utils/application-utils";
import {
  getShortcutScope,
  getShortcutSlots,
  type ShortcutPositions,
} from "../utils/shortcut-grid";

type ApplicationId = Application["id"];

const getSiblings = (applications: Application[], parentId?: number) => {
  if (parentId === undefined) return applications;
  const parent = findApplication(applications, parentId);
  return parent?.type === "explorer" ? parent.applications : null;
};

const nameExists = (applications: Application[], name: string, exceptId?: number) =>
  applications.some(
    (application) =>
      application.id !== exceptId &&
      application.type !== "settings" &&
      application.label.toLowerCase() === name.toLowerCase(),
  );

const migrateApplications = (applications: Application[]): Application[] => {
  const migrated: Application[] = [];

  applications.forEach((application) => {
    if (application.type === "explorer") {
      migrated.push({
        ...application,
        applications: migrateApplications(application.applications ?? []),
      });
      return;
    }

    if (application.type === "execute" && !application.src?.from) return;

    migrated.push(application);
  });

  return migrated;
};

export type ApplicationStoreState = {
  hydrated: boolean;
  applications: Application[];
  shortcutPositions: ShortcutPositions;
  openApplication: (id: ApplicationId) => void;
  closeApplication: (id: ApplicationId) => void;
  collapseApplication: (id: ApplicationId) => void;
  createApplication: (
    type: CreatableApplicationType,
    label: string,
    parentId?: number,
  ) => number | null;
  updateContent: (id: ApplicationId, content: string) => void;
  renameApplication: (id: ApplicationId, label: string) => boolean;
  moveShortcut: (id: ApplicationId, slot: number, folderId?: number) => void;
};

export const createApplicationStore = () =>
  createStore<ApplicationStoreState>()(
    persist(
      immer((set, get) => ({
        hydrated: false,
        applications: structuredClone(initialApplications),
        shortcutPositions: {},
        openApplication: (id) =>
          set((state) => {
            const application = findApplication(state.applications, id);
            if (!application) return;

            application.state = "opened";
            application.windowOrder =
              Math.max(
                0,
                ...getApplications(state.applications).map(
                  (item) => item.windowOrder ?? 0,
                ),
              ) + 1;
          }),
        closeApplication: (id) =>
          set((state) => {
            const application = findApplication(state.applications, id);
            if (application) application.state = "standby";
          }),
        collapseApplication: (id) =>
          set((state) => {
            const application = findApplication(state.applications, id);
            if (application && application.state === "opened") application.state = "collapsed";
          }),
        createApplication: (type, label, parentId) => {
          const name = label.trim();
          if (!name) return null;
          const siblings = getSiblings(get().applications, parentId);
          if (!siblings || nameExists(siblings, name)) return null;

          const id =
            Math.max(
              0,
              ...getApplications(get().applications).map(
                (application) => application.id,
              ),
            ) + 1;

          set((state) => {
            getSiblings(state.applications, parentId)?.push(
              createApplication(type, id, name),
            );
          });
          return id;
        },
        updateContent: (id, content) =>
          set((state) => {
            const application = findApplication(state.applications, id);

            if (application?.type === "notebook") application.content = content;
            if (
              application?.type === "execute" &&
              application.src.from === "user"
            ) {
              application.src.html = content;
            }
          }),
        renameApplication: (id, label) => {
          const name = label.trim();
          if (!name) return false;

          const applications = get().applications;
          const parent = getApplications(applications).find(
            (application) =>
              application.type === "explorer" &&
              application.applications.some((child) => child.id === id),
          );
          const siblings =
            parent?.type === "explorer" ? parent.applications : applications;
          if (
            !siblings.some((application) => application.id === id) ||
            nameExists(siblings, name, id)
          ) {
            return false;
          }

          set((state) => {
            const application = findApplication(state.applications, id);
            if (!application) return;

            application.label = name;
            application.name = name;
          });
          return true;
        },
        moveShortcut: (id, slot, folderId) =>
          set((state) => {
            if (!Number.isSafeInteger(slot) || slot < 0 || slot > 10000) return;
            const siblings = getSiblings(state.applications, folderId);
            if (!siblings) return;
            const scope = getShortcutScope(folderId);
            const positions = state.shortcutPositions[scope] ?? {};
            const slots = getShortcutSlots(siblings, positions);
            const source = [...slots.entries()].find(
              ([, application]) => application.id === id,
            )?.[0];
            if (source === undefined || source === slot) return;
            const occupied = slots.get(slot);
            state.shortcutPositions[scope] = {
              ...positions,
              [id]: slot,
              ...(occupied ? { [occupied.id]: source } : {}),
            };
          }),
      })),
      {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
        version: 4,
        migrate: (persisted) => {
          const previous = persisted as Partial<ApplicationStoreState>;

          return {
            ...previous,
            applications: Array.isArray(previous.applications)
              ? migrateApplications(previous.applications)
              : [],
          };
        },
        partialize: (state) => ({
          applications: state.applications,
          shortcutPositions: state.shortcutPositions,
        }),
        skipHydration: true,
        merge: (persisted, current) => {
          const stored = persisted as Partial<ApplicationStoreState> | null | undefined;
          const hasApplications = Array.isArray(stored?.applications);

          const applications = structuredClone(
            hasApplications ? stored.applications! : current.applications,
          );
          const folder = applications.find(
            (application) => application.id === 1 && application.type === "explorer",
          );
          const bundledFolder = initialApplications.find(
            (application) => application.id === 1 && application.type === "explorer",
          );

          if (folder?.type === "explorer" && bundledFolder?.type === "explorer") {
            bundledFolder.applications.forEach((bundled) => {
              if (folder.applications.some((item) => item.name === bundled.name)) return;

              const id = getApplications(applications).some(
                (item) => item.id === bundled.id,
              ) ? -bundled.id : bundled.id;

              folder.applications.push({ ...structuredClone(bundled), id });
            });
          }

          if (!applications.some((application) => application.type === "settings")) {
            const settings = initialApplications.find(
              (application) => application.type === "settings",
            );
            if (settings) applications.push(structuredClone(settings));
          }

          const shortcutPositions =
            stored?.shortcutPositions &&
            typeof stored.shortcutPositions === "object"
              ? stored.shortcutPositions
              : {};

          return { ...current, applications, shortcutPositions };
        },
      },
    ),
  );

export type ApplicationStoreApi = ReturnType<typeof createApplicationStore>;
