import type { CreateRemovalProfileParams } from "../../hooks";

export interface FormProps extends Omit<
  Required<CreateRemovalProfileParams>,
  "access_group"
> {
  access_group?: string;
  days_without_exchange: number | "";
}
