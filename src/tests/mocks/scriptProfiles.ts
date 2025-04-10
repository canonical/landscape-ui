import type { ScriptProfile } from "@/features/script-profiles";

export const scriptProfiles: ScriptProfile[] = [
  {
    access_group: "global",
    computers: {
      num_associated_computers: 12,
    },
    created_at: "",
    created_by: { id: 0, name: "" },
    id: 1,
    last_activity: 0,
    script_id: 1,
    tags: [],
    time_limit: 300,
    title: "Profile name",
    trigger: { trigger_type: "event", event_type: "post_enrollment" },
    username: "Root",
  },
];
