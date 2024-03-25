import { CommonPackagesActionParams } from "@/hooks/usePackages";

export interface FormProps
  extends Pick<
    CommonPackagesActionParams,
    "deliver_after" | "deliver_delay_window"
  > {
  deliver_immediately: boolean;
  randomize_delivery: boolean;
  version: string;
}
