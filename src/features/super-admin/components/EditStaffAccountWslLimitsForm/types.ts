import type { WslFeatureLimits } from "../../types";

/** Each limit, or `""` while its field is empty. */
export type FormProps = Record<keyof WslFeatureLimits, number | "">;

export interface WslLimitChange {
  label: string;
  from: number;
  to: number;
}
