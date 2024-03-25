import {
  CreatePackageProfileParams,
  EditPackageProfileParams,
} from "@/features/package-profiles/hooks/usePackageProfiles";
import {
  PackageProfileConstraint,
  PackageProfileConstraintType,
} from "@/features/package-profiles/types/PackageProfile";

interface Constraint extends PackageProfileConstraint {
  constraint: PackageProfileConstraintType | "";
  notAnyVersion: boolean;
}

export interface DuplicateFormProps
  extends Omit<Required<CreatePackageProfileParams>, "constraints"> {
  constraints: Constraint[];
  step: number;
}

export interface AddFormProps extends DuplicateFormProps {
  constraintsType: string;
  csvFile: File | null;
  instanceId: number;
  isCsvFileParsed: boolean;
  material: string;
}

export interface ConstraintsEditFormProps {
  constraints: Constraint[];
}

export type EditFormProps = Required<
  Omit<EditPackageProfileParams, "name" | "constraints">
>;
