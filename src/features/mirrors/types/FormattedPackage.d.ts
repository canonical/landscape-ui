export interface FormattedPackage extends Record<string, unknown> {
  packageName: string;
  packageVersion: string;
  difference?: "update" | "delete" | "add";
  newVersion?: string;
}
