import type { AssociationBlockFormProps } from "@/components/form/AssociationBlock";
import type { ScheduleBlockFormProps } from "@/components/form/ScheduleBlock";
import type { AddSecurityProfileParams } from "../api/useAddSecurityProfile";

export type SecurityProfileAddFormValues = AssociationBlockFormProps &
  ScheduleBlockFormProps &
  Required<Pick<AddSecurityProfileParams, "access_group" | "title">> &
  Partial<Pick<AddSecurityProfileParams, "benchmark" | "mode">> & {
    delivery_time: "asap" | "scheduled";
    randomize_delivery: "no" | "yes";
    tailoring_file: File | null;
  };
