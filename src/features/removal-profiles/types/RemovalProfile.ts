import type { Profile } from "@/features/profiles";

export interface RemovalProfile extends Profile {
  cascade_to_children: boolean;
  computers: { num_associated_computers: number };
  days_without_exchange: number;
}
