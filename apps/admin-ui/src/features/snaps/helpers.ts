import type { InstalledSnap } from "./types";

export enum EditSnapType {
  Switch = "Switch",
  Refresh = "Refresh",
  Uninstall = "Uninstall",
  Hold = "Hold",
  Unhold = "Unhold",
}

export const getSnapUpgradeCounts = (
  snaps: InstalledSnap[],
): { held: number; unheld: number } => {
  return snaps.reduce(
    (counts, snap) => {
      if (snap.held_until !== null) {
        counts.held++;
      } else {
        counts.unheld++;
      }

      return counts;
    },
    { held: 0, unheld: 0 },
  );
};

export const getSelectedSnaps = (
  snaps: InstalledSnap[],
  selectedSnaps: string[],
): InstalledSnap[] => {
  return snaps.filter((snap) => selectedSnaps.includes(snap.snap.id));
};
