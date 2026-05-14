import type { AssociationBlockFormProps } from "@/components/form/AssociationBlock";
import type { ScheduleBlockFormProps } from "@/components/form/ScheduleBlock";
import type { AddUSGProfileParams } from "../api/useAddUsgProfile";

export interface USGProfileFormValues
  extends
    AssociationBlockFormProps,
    ScheduleBlockFormProps,
    Required<Pick<AddUSGProfileParams, "access_group" | "title">>,
    Partial<Pick<AddUSGProfileParams, "benchmark" | "mode">> {
  delivery_time: "asap" | "delayed";
  randomize_delivery: boolean;
  deliver_delay_window: number;
  restart_deliver_delay: number;
  tailoring_file: File | null;
}
