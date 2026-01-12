import type {
  InstalledPackageAction,
  InstalledPackageActionAppearance,
  PackageAction,
  PackageActionFormType,
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

export const PACKAGE_ACTION_TYPES: Record<
  PackageAction,
  PackageActionFormType
> = {
  install: {
    action: "install",
    title: "Install",
    past: "installed",
    search: "available",
  },
  uninstall: {
    action: "uninstall",
    title: "Uninstall",
    past: "uninstalled",
    search: "installed",
  },
  hold: {
    action: "hold",
    title: "Hold",
    past: "held",
    search: "available",
  },
  unhold: {
    action: "unhold",
    title: "Unhold",
    past: "unheld",
    search: "held",
  },
};
