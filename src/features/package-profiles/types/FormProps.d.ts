import {
  CopyPackageProfileParams,
  CreatePackageProfileParams,
  EditPackageProfileParams,
} from "../hooks/usePackageProfiles";

import {
  PackageProfileConstraint,
  PackageProfileConstraintType,
} from "./PackageProfile";

interface Constraint extends PackageProfileConstraint {
  constraint: PackageProfileConstraintType | "";
  notAnyVersion: boolean;
}

export interface AddFormProps
  extends Omit<Required<CreatePackageProfileParams>, "constraints"> {
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
