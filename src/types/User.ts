import type { ActivityStatus } from "@/features/activities";

export interface PendingUserActivity {
  activity_id: number;
  activity_status: ActivityStatus;
  summary: string;
  operation: "lock" | "unlock" | "delete";
}

export interface User extends Record<string, unknown> {
  enabled: boolean;
  primary_gid: number;
  uid: number;
  pending_activity: PendingUserActivity | null;
  name?: string;
  username: string;
  home_phone?: string;
  location?: string;
  work_phone?: string;
}

export interface Group {
  computer_id: number;
  gid: number;
  id: number;
  name: string;
}

export interface GroupsResponse {
  groups: Group[];
}
