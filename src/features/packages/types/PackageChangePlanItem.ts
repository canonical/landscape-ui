export interface ComputerRef {
  id: number;
  name: string;
}

export interface PackageChangePlanItem extends Record<string, unknown> {
  id: number;
  package_id: number;
  computer: ComputerRef;
}
