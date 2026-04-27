import type { Activity } from "@/features/activities";
import type { Profile } from "@/features/profiles";

export type Trigger =
  | {
      trigger_type: "event";
      event_type: "post_enrollment";
    }
  | {
      trigger_type: "one_time";
      next_run: string;
      last_run: string;
      timestamp: string;
    }
  | {
      trigger_type: "recurring";
      interval: string;
      next_run: string;
      last_run: string;
      start_after: string;
    };

export interface ScriptProfile extends Profile {
  activities: {
    last_activity: Activity | null;
  };
  archived: boolean;
  computers: { num_associated_computers: number };
  created_at: string;
  created_by: { name: string; id: number } | null;
  last_edited_at: string;
  script_id: number;
  time_limit: number;
  trigger: Trigger;
  username: string;
}
