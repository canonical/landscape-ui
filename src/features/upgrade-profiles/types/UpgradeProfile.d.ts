export type UpgradeProfileType = "security" | "all";

export type UpgradeProfileFrequency = "hour" | "week";

export type UpgradeProfileDay = "mo" | "tu" | "we" | "th" | "fr" | "sa" | "su";

export interface UpgradeProfile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  at_minute: `${number}`;
  autoremove: boolean;
  deliver_delay_window: `${number}`;
  deliver_within: `${number}`;
  every: UpgradeProfileFrequency;
  id: number;
  name: string;
  next_run: string;
  tags: string[];
  title: string;
  upgrade_type: UpgradeProfileType;
  at_hour?: `${number}`;
  on_days?: UpgradeProfileDay[];
}
