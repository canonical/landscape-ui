import { Constraint } from "@/features/package-profiles/types";

export const EMPTY_CONSTRAINT: Constraint = {
  constraint: "",
  notAnyVersion: false,
  package: "",
  rule: "",
  version: "",
};

export const TOUCHED_CONSTRAINT: Record<keyof Constraint, true> =
  Object.fromEntries(Object.keys(EMPTY_CONSTRAINT).map((key) => [key, true]));
