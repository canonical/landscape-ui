/**
 * A minimal external store mirroring the instances page selection, so that
 * components living outside the page tree (such as side panel content, whose
 * props are frozen when the panel opens) can observe the live selection via
 * useSyncExternalStore.
 */

let selectedInstanceIds: readonly number[] = [];
const listeners = new Set<() => void>();

export const setSelectedInstanceIds = (ids: readonly number[]): void => {
  // Copy and freeze so callers can't mutate the store's snapshot in place
  // (which would change state without notifying useSyncExternalStore listeners).
  // The readonly types make any such mutation a compile-time error.
  selectedInstanceIds = Object.freeze([...ids]);
  listeners.forEach((listener) => {
    listener();
  });
};

export const getSelectedInstanceIds = (): readonly number[] =>
  selectedInstanceIds;

export const subscribeToSelectedInstanceIds = (
  listener: () => void,
): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
