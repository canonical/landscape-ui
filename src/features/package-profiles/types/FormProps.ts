import type {
  CopyPackageProfileParams,
  CreatePackageProfileParams,
  EditPackageProfileParams,
} from "../hooks/usePackageProfiles";

import type {
  PackageProfileConstraint,
  PackageProfileConstraintType,
} from "./PackageProfile";

export interface Constraint extends Record<string, unknown> {
  constraint: PackageProfileConstraintType | "";
  id: number;
  notAnyVersion: boolean;
  package: string;
  rule: string;
  version: string;
}

export interface AddFormProps extends Omit<
  Required<CreatePackageProfileParams>,
  "constraints"
> {
  constraints: Omit<Constraint, "id">[];
  constraintsType: string;
  csvFile: File | null;
  isCsvFileParsed: boolean;
}

export interface ConstraintsFormProps {
  constraints: Omit<Constraint, "id">[];
}

export type DuplicateFormProps = Required<
  Omit<CopyPackageProfileParams, "copy_from">
>;

export type EditFormProps = Required<
  Omit<EditPackageProfileParams, "name" | "constraints">
>;
