import type { CreateUpgradeProfileParams } from "../hooks/useUpgradeProfiles";

export interface FormProps extends Omit<
  Required<CreateUpgradeProfileParams>,
  | "access_group"
  | "at_hour"
  | "at_minute"
  | "deliver_delay_window"
  | "deliver_within"
> {
  access_group?: string;
  at_hour: number | "";
  at_minute: number | "";
  deliver_delay_window: number;
  deliver_within: number | "";
  randomize_delivery: boolean;
}
