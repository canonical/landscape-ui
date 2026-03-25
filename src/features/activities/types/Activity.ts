import type { Creator } from "./Creator";

export type ActivityStatus =
  | "succeeded"
  | "scheduled"
  | "waiting"
  | "undelivered"
  | "delivered"
  | "blocked"
  | "unapproved"
  | "canceled"
  | "failed";

interface ActivityActions {
  approvable: boolean;
  cancelable: boolean;
  reappliable: boolean;
  revertable: boolean;
}

export interface ActivityCommon extends Record<string, unknown> {
  activity_status: ActivityStatus;
  completion_time: string | null;
  computer_id: number;
  creation_time: string;
  creator: Creator;
  id: number;
  parent_id: number | null;
  result_code: number | null;
  result_text: string | null;
  summary: string;
  type: string;
  actions?: ActivityActions;
}

interface ScheduleWindow extends Record<string, unknown> {
  children: ActivityCommon[];
  modification_time: string;
  schedule_after_time: string | null;
  schedule_before_time: string | null;
}

interface DeliveryWindow extends Record<string, unknown> {
  approval_time: string | null;
  computer_id: number;
  deliver_after_time: string | null;
  deliver_before_time: string | null;
  delivery_time: string | null;
}

interface PackageChanges extends Record<string, unknown> {
  changes: string[];
  package_ids: number[];
}

interface PocketInfo extends Record<string, unknown> {
  pocket_id: number;
  pocket_name: string;
  progress: number;
}

interface DelayWindow extends Record<string, unknown> {
  deliver_delay_window: number;
}

// Suitable for activity types: `ActivityGroup`
export type ActivityGroup = ActivityCommon & DelayWindow;

// Suitable for activity types: `SyncPocketRequest`
export type SyncPocketRequest = ActivityCommon & ScheduleWindow & PocketInfo;

// Suitable for activity types:
//   `AddGroupMemberRequest`,
//   `ChangeRepositoryProfilesRequest`,
//   `CreateGroupRequest`,
//   `CreateUserRequest`,
//   `EditUserRequest`,
//   `ExecuteScriptRequest`,
//   `LockUserRequest`,
//   `RemoveGroupMemberRequest`,
//   `RestartRequest`,
//   `UnlockUserRequest`
export type ActivityMostlyCommon = ActivityCommon &
  DeliveryWindow &
  ScheduleWindow;

// Suitable for activity types:
//   `ChangePackageProfilesRequest`,
//   `ChangePackagesRequest`,
//   `UpgradeAllPackagesRequest`
export type ActivityPackagesRequest = ActivityMostlyCommon & PackageChanges;

export type Activity =
  | ActivityGroup
  | SyncPocketRequest
  | ActivityMostlyCommon
  | ActivityPackagesRequest;
