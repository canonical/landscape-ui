import { CreateRemovalProfileParams } from "@/features/removal-profiles/hooks";

export interface FormProps extends Required<CreateRemovalProfileParams> {
  days_without_exchange: number | "";
}
