import type { PackageChangePlanActionType } from "./PackageChangePlan";

export type PackageChangePlanAction<
  T extends PackageChangePlanActionType = PackageChangePlanActionType,
> = T extends "change_version"
  ? {
      type: T;
      from_package: {
        id: number;
        name: string;
        version: string;
      };
      to_package: {
        id: number;
        name: string;
        version: string;
      };
    }
  : T extends "upgrade"
    ? {
        type: T;
        to_package: {
          id: number;
          name: string;
          version: string;
        };
      }
    : {
        type: T;
        package: {
          id: number;
          name: string;
          version: string;
        };
      };

export interface PackageChangePlanItem extends Record<string, unknown> {
  action: PackageChangePlanAction<PackageChangePlanActionType>;
  computer: {
    id: number;
    name: string;
  };
}
