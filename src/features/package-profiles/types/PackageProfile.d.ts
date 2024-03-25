export type PackageProfileConstraintType = "depends" | "conflicts";

export interface PackageProfileConstraint extends Record<string, unknown> {
  constraint: PackageProfileConstraintType;
  package: string;
  rule: string;
  version: string;
}

export interface PackageProfile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  computers: {
    constrained: number[];
    "non-compliant": number[];
    pending: number[];
  };
  constraints: PackageProfileConstraint[];
  creation_time: string;
  description: string;
  id: number;
  modification_time: string;
  name: string;
  tags: string[];
  title: string;
  version: string;
}
