import type { Instance } from "@/types/Instance";

/** What every tab of an instance's page in a support session is given. */
export interface SupportInstanceTabProps {
  /** The account the instance belongs to. */
  readonly name: string;
  readonly instance: Instance;
}
