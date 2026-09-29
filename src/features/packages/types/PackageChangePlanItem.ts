export interface PackageChangePlanItem extends Record<string, unknown> {
  action:
    | {
        type: "install" | "remove" | "hold" | "unhold";
        package: {
          id: number;
          name: string;
          version: string;
        };
      }
    | {
        type: "upgrade";
        to_package: {
          id: number;
          name: string;
          version: string;
        };
      }
    | {
        type: "change_version";
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
      };
  computer: {
    id: number;
    name: string;
  };
}
