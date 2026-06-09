import { getSelectionLabel } from "@/utils/_helpers";
import type { InstalledSnap } from "../../types";

export const getSnapName = (snaps: InstalledSnap[]) =>
  getSelectionLabel(snaps, (s) => s.snap.name, "snaps");

export const getSelectedSnaps = (
  snaps: InstalledSnap[],
  selectedSnapIds: string[],
): InstalledSnap[] =>
  snaps.filter((snap) => selectedSnapIds.includes(snap.snap.id));
