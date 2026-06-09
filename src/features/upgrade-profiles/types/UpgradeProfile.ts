import type { Profile } from "@/features/profiles";

export type UpgradeProfileType = "security" | "all";

export type UpgradeProfileFrequency = "hour" | "week";

export type UpgradeProfileDay = "mo" | "tu" | "we" | "th" | "fr" | "sa" | "su";

export interface UpgradeProfile extends Profile {
  at_minute: `${number}`;
  autoremove: boolean;
  computers: { num_associated_computers: number };
  deliver_delay_window: `${number}`;
  deliver_within: `${number}`;
  every: UpgradeProfileFrequency;
  next_run: string;
  upgrade_type: UpgradeProfileType;
  at_hour?: `${number}`;
  on_days?: UpgradeProfileDay[];
}
