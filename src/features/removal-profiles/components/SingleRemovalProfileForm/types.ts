import type { CreateRemovalProfileParams } from "../../hooks";

export interface FormProps extends Omit<
  Required<CreateRemovalProfileParams>,
  "access_group" | "days_without_exchange"
> {
  access_group?: string;
  days_without_exchange: number | "";
}
