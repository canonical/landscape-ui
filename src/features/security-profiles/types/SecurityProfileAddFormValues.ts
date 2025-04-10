import type { AssociationBlockFormProps } from "@/components/form/AssociationBlock";
import type { ScheduleBlockFormProps } from "@/components/form/ScheduleBlock";
import type { AddSecurityProfileParams } from "../api/useAddSecurityProfile";

export interface SecurityProfileFormValues
  extends AssociationBlockFormProps,
    ScheduleBlockFormProps,
    Required<Pick<AddSecurityProfileParams, "access_group" | "title">>,
    Partial<Pick<AddSecurityProfileParams, "benchmark" | "mode">> {
  delivery_time: "asap" | "delayed";
  randomize_delivery: "no" | "yes";
  restart_deliver_delay_window: number;
  restart_deliver_delay: number;
  tailoring_file: File | null;
}
