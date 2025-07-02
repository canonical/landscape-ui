import type { CreateRemovalProfileParams } from "../../hooks";

export interface FormProps extends Required<CreateRemovalProfileParams> {
  days_without_exchange: number | "";
}
