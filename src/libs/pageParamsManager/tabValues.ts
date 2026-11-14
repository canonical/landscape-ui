import type { TabSlot, TabSlots } from "./types";

/**
 * Slots for scoped "tab" URL values ("slot:id"). Each names a tab strip that
 * can coexist with the bare page-level "tab" value. Values for any other slot
 * are dropped by sanitizeSearchParams.
 */
export const TAB_SLOTS = ["activities", "panel", "upgrades"] as const;

export const TAB_PARAM = "tab";

const TAB_SLOT_SEPARATOR = ":";
const KNOWN_TAB_SLOTS: readonly string[] = TAB_SLOTS;

const isTabSlot = (value: string): value is TabSlot =>
  KNOWN_TAB_SLOTS.includes(value);

type TabValue =
  { kind: "page"; id: string } | { kind: "slot"; slot: TabSlot; id: string };

/**
 * Classifies one raw "tab" value: a bare id is the page-level strip, and
 * "slot:id" is a slot-scoped strip. Empty, unknown-slot and multi-colon
 * values are invalid.
 */
export const parseTabValue = (value: string): TabValue | null => {
  const separatorIndex = value.indexOf(TAB_SLOT_SEPARATOR);

  if (separatorIndex === -1) {
    return value ? { kind: "page", id: value } : null;
  }

  const slot = value.slice(0, separatorIndex);
  const id = value.slice(separatorIndex + 1);

  if (!id || id.includes(TAB_SLOT_SEPARATOR) || !isTabSlot(slot)) {
    return null;
  }

  return { kind: "slot", slot, id };
};

/**
 * Rewrites every "tab" value in place, ahead of the other params: the bare
 * page tab first, then the non-empty slot values in slot-name order.
 */
export const setTabValues = (
  searchParams: URLSearchParams,
  tab: string,
  tabSlots: TabSlots,
): void => {
  const otherParams = [...searchParams].filter(([key]) => key !== TAB_PARAM);

  for (const key of new Set(searchParams.keys())) {
    searchParams.delete(key);
  }

  if (tab) {
    searchParams.append(TAB_PARAM, tab);
  }

  for (const slot of TAB_SLOTS) {
    const id = tabSlots[slot];

    if (id) {
      searchParams.append(TAB_PARAM, `${slot}${TAB_SLOT_SEPARATOR}${id}`);
    }
  }

  for (const [key, value] of otherParams) {
    searchParams.append(key, value);
  }
};
