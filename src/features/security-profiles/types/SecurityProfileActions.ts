import type { SecurityProfile } from "./SecurityProfile";

type SecurityProfileAction = (values: SecurityProfile) => void;

export interface SecurityProfileActions {
  duplicate: SecurityProfileAction;
  edit: SecurityProfileAction;
}
