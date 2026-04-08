import type { CreateUpgradeProfileParams } from "../hooks/useUpgradeProfiles";

export interface FormProps extends Omit<
  Required<CreateUpgradeProfileParams>,
  "access_group" | "at_hour" | "at_minute" | "deliver_delay_window"
> {
  access_group?: string;
  at_hour: number | "";
  at_minute: number | "";
  deliver_delay_window: number;
  randomize_delivery: boolean;
}
