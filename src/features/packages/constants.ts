import type {
  InstalledPackageAction,
  InstalledPackageActionAppearance,
} from "./types";

export const INSTALLED_PACKAGE_ACTIONS: Record<
  InstalledPackageAction,
  {
    appearance: InstalledPackageActionAppearance;
    icon: string;
    label: string;
    order: number;
  }
> = {
  downgrade: {
    appearance: "positive",
    icon: "begin-downloading",
    label: "Downgrade",
    order: 4,
  },
  hold: {
    appearance: "positive",
    icon: "pause",
    label: "Hold",
    order: 2,
  },
  remove: {
    appearance: "negative",
    icon: "delete",
    label: "Uninstall",
    order: 1,
  },
  unhold: {
    appearance: "positive",
    icon: "play",
    label: "Unhold",
    order: 3,
  },
  upgrade: {
    appearance: "positive",
    icon: "change-version",
    label: "Upgrade",
    order: 5,
  },
};
