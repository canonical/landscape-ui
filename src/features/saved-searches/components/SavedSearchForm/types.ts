import type {
  BOOLEANS,
  LICENSE_TYPES,
  LOGICAL_OPERATORS,
  PROFILE_TYPES,
  USG_STATUSES,
  VALID_ROOT_KEYS,
  WSL_STATUSES,
} from "./constants";

export interface FormProps {
  title: string;
  search: string;
}
export interface MonacoRange {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
}

type ArrayToUnion<T extends readonly string[]> = T[number];

export type ValidRootKey = ArrayToUnion<typeof VALID_ROOT_KEYS>;
export type ProfileType = ArrayToUnion<typeof PROFILE_TYPES>;
export type UsgStatus = ArrayToUnion<typeof USG_STATUSES>;
export type WslStatus = ArrayToUnion<typeof WSL_STATUSES>;
export type LicenseType = ArrayToUnion<typeof LICENSE_TYPES>;
export type BooleanString = ArrayToUnion<typeof BOOLEANS>;
export type LogicalOperator = ArrayToUnion<typeof LOGICAL_OPERATORS>;
export type ValidationResult = string | undefined;
