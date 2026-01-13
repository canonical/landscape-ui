export type InstalledPackageAction =
  | "downgrade"
  | "hold"
  | "remove"
  | "unhold"
  | "upgrade";

export type InstalledPackageActionAppearance = "positive" | "negative";

export type PackageAction = "install" | "uninstall" | "hold" | "unhold";
