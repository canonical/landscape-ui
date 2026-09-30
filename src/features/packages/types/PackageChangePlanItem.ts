import type { PackageChangePlanActionType } from "./PackageChangePlan";

export interface PackageChangePlanAction<
  T extends PackageChangePlanActionType = PackageChangePlanActionType,
> {
  type: T;
  package: T extends "install" | "remove" | "hold" | "unhold"
    ? {
        id: number;
        name: string;
        version: string;
      }
    : never;
  from_package: T extends "change_version"
    ? {
        id: number;
        name: string;
        version: string;
      }
    : never;
  to_package: T extends "change_version" | "upgrade"
    ? {
        id: number;
        name: string;
        version: string;
      }
    : never;
}

export interface PackageChangePlanItem extends Record<string, unknown> {
  action: PackageChangePlanAction<PackageChangePlanActionType>;
  computer: {
    id: number;
    name: string;
  };
}
