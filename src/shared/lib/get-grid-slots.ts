export function getGridSlots<T extends { id: number }>(
  items: readonly T[],
  positions: Record<number, number> = {},
): Map<number, T> {
  const slots = new Map<number, T>();

  items.forEach((item, index) => {
    let slot = positions[item.id] ?? index;

    if (!Number.isSafeInteger(slot) || slot < 0) slot = index;
    while (slots.has(slot)) slot += 1;

    slots.set(slot, item);
  });

  return slots;
}
