import type { Profile, ComplianceInstanceCounts } from "@/features/profiles";

export type PackageProfileConstraintType = "depends" | "conflicts" | "";

export interface PackageProfileConstraint extends Record<string, unknown> {
  constraint: PackageProfileConstraintType;
  id: number;
  package: string;
  rule: string;
  version: string;
}

export interface PackageProfile extends Profile {
  computers: ComplianceInstanceCounts;
  constraints: PackageProfileConstraint[];
  creation_time: string;
  modification_time: string;
  version: string;
}
