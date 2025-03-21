import type { AssociationBlockFormProps } from "@/components/form/AssociationBlock";
import type { ScheduleBlockFormProps } from "@/components/form/ScheduleBlock/types";

export interface SecurityProfileAddFormValues
  extends AssociationBlockFormProps,
    ScheduleBlockFormProps {
  access_group: string;
  base_profile: "cis" | "disa-stig" | "";
  delivery_time: "asap" | "scheduled";
  mode: "audit-only" | "fix-and-audit" | "fix-restart-audit" | "";
  name: string;
  randomize_delivery: "no" | "yes";
  tailoring_file: File | null;
}
