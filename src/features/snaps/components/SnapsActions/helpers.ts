import { getSelectionLabel } from "@/utils/_helpers";
import type { InstalledSnap } from "../../types";

export const getSnapName = (snaps: InstalledSnap[]) =>
  getSelectionLabel(snaps, (s) => s.snap.name, "snaps");
