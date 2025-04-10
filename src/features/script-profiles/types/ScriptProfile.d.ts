export type Trigger =
  | {
      trigger_type: "event";
      event_type: "post_enrollment";
    }
  | { trigger_type: "one-time"; timestamp: string }
  | { trigger_type: "recurring"; start_after: string; interval: string };

export interface ScriptProfile extends Record<string, unknown> {
  access_group: string;
  archived: boolean;
  computers: { num_associated_computers: number };
  created_at: string;
  created_by: { name: string; id: number } | null;
  id: number;
  last_activity: number;
  script_id: number;
  tags: string[];
  time_limit: number;
  title: string;
  trigger: Trigger;
  username: string;
}
