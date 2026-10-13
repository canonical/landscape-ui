import type { ActivityStatus } from "@/features/activities";

export type UserProfileField =
  | "name"
  | "password"
  | "primary_group"
  | "location"
  | "home_phone"
  | "work_phone";

interface UserProfileActivityChange {
  kind: "profile";
  field: UserProfileField;
}

interface UserAdditionalGroupActivityChange {
  kind: "additional_group";
  group_name: string;
  operation: "add" | "remove";
}

export type UserActivityChange =
  UserProfileActivityChange | UserAdditionalGroupActivityChange;

export interface UserActivityEvent {
  activity_id: number;
  summary: string;
  activity_status: ActivityStatus;
  changes: UserActivityChange[];
  completion_time: string | null;
  creation_time: string;
}
