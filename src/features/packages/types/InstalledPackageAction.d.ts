export type InstalledPackageAction =
  | "downgrade"
  | "hold"
  | "remove"
  | "unhold"
  | "upgrade";

export type PackageAction = InstalledPackageAction | "install" | "uninstall";

export type InstalledPackageActionAppearance = "positive" | "negative";
