import type { Profile } from "@/features/profiles";

export interface RebootProfile extends Profile {
  next_run: string;
  schedule: string;
  deliver_within: number;
  deliver_delay_window: number;
  num_computers: number;
}
