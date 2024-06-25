import { CreateUpgradeProfileParams } from "../hooks/useUpgradeProfiles";

export interface FormProps extends Required<CreateUpgradeProfileParams> {
  at_hour: number | "";
  at_minute: number | "";
  deliver_delay_window: number | "";
  randomizeDelivery: boolean;
}
