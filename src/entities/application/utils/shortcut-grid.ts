export type ShortcutPositions = Record<string, Record<number, number>>;

export const getShortcutScope = (folderId?: number) =>
  folderId === undefined ? "desktop" : `folder:${folderId}`;

export { getGridSlots as getShortcutSlots } from "@/shared/lib/get-grid-slots";
