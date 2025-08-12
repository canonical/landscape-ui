import type { RebootProfile } from "../../types/RebootProfile";

export interface FormProps {
  title: string;
  access_group: string;
  all_computers: boolean;
  tags: string[];
  deliver_within: number;
  deliver_delay_window: string;
  at_hour: number | "";
  at_minute: number | "";
  on_days: string[];
  randomize_delivery: boolean;
}

export type RebootProfilesFormProps = (
  | { action: "add" }
  | { action: "edit"; profile: RebootProfile }
  | { action: "duplicate"; profile: RebootProfile }
) & { hasBackButton?: boolean };

export type RebootProfileDay = "mo" | "tu" | "we" | "th" | "fr" | "sa" | "su";
