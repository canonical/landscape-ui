export interface SecurityProfileAddFormValues {
  accessGroup: string;
  all_computers: boolean;
  baseProfile: "cis" | "disa-stig" | "";
  cronSchedule: string;
  deliveryTime: "asap" | "scheduled";
  ends: "never" | "onADate";
  mode: "auditOnly" | "fixAndAudit" | "fixRestartAudit" | "";
  name: string;
  on: string[];
  randomizeDelivery: boolean;
  repeatEvery: number;
  repeatEveryType: "days" | "weeks" | "months" | "years";
  schedule: "onADate" | "recurring" | "";
  startDate: string;
  tags: string[];
  useCronJobFormat: boolean;
}
