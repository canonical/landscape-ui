import type {
  Activity,
  ActivityGroup,
  ActivityStatus,
} from "@/features/activities";
import type { User } from "@/types/User";
import { activities, SNAP_ACTION_ACTIVITY } from "./activity";
import { ubuntuInstance, ubuntuCoreInstance } from "./instance";
import { users, usersWithPendingActivities } from "./user";

const STATUSES: ActivityStatus[] = [
  "unapproved",
  "delivered",
  "succeeded",
  "failed",
  "scheduled",
  "waiting",
  "undelivered",
  "blocked",
  "canceled",
];
const REPETITIONS = 3;
const demoStatuses = Array.from({ length: REPETITIONS }, () => STATUSES).flat();
const GROUP_COUNT = demoStatuses.length;
const CHILD_COUNT = demoStatuses.length;
const GROUP_ID = 10000;
const CHILD_ID = 20000;
const [, base] = activities;
const creationTime = "2026-10-23T09:00:00Z";

export const activityDemoGroups: ActivityGroup[] = demoStatuses.map(
  (status, index) => {
    return {
      id: GROUP_ID + index,
      type: "ActivityGroup",
      summary: `Demo ${status} group ${index + 1}: ${index % 2 ? "without output" : "with output"}`,
      activity_status: status,
      creation_time: creationTime,
      completion_time: ["succeeded", "failed", "canceled"].includes(status)
        ? "2026-10-23T09:05:00Z"
        : null,
      creator: base.creator,
      computer_id: 0,
      computer_title: "",
      parent_id: null,
      result_code: status === "failed" ? 1 : null,
      result_text:
        index % 2
          ? null
          : "Starting activity group...\nProcessing instances...\nGroup output is available here.",
      deliver_delay_window: 0,
    };
  },
);

export const activityDemoChildren: Activity[] = activityDemoGroups.flatMap(
  (group, groupIndex) =>
    demoStatuses.map((childStatus, index): Activity => {
      const instance = index % 2 ? ubuntuCoreInstance : ubuntuInstance;
      const status = groupIndex < 2 ? group.activity_status : childStatus;
      const hasOutput = index % 2 === 0;
      let resultCode: number | null = null;
      if (status === "failed") resultCode = 1;
      if (status === "succeeded") resultCode = 0;
      return {
        ...base,
        id: CHILD_ID + groupIndex * CHILD_COUNT + index,
        parent_id: group.id,
        computer_id: instance.id,
        computer_title: instance.title,
        activity_status: status,
        type: index % 2 ? "UpgradeAllPackagesRequest" : "ExecuteScriptRequest",
        summary: `Demo ${status}: ${instance.title} - ${hasOutput ? "script with output" : "package upgrade without output"} (${groupIndex + 1}.${index + 1})`,
        creation_time: creationTime,
        modification_time: creationTime,
        approval_time: status === "unapproved" ? null : creationTime,
        delivery_time: ["succeeded", "failed", "delivered"].includes(status)
          ? creationTime
          : null,
        completion_time: ["succeeded", "failed", "canceled"].includes(status)
          ? "2026-10-23T09:05:00Z"
          : null,
        result_code: resultCode,
        result_text: hasOutput
          ? `Instance: ${instance.title}\nRunning maintenance...\n${status === "failed" ? "ERROR: maintenance command exited with code 1." : "Maintenance output ready."}`
          : null,
        creator: index % 3 ? base.creator : null,
        actions: {
          approvable: status === "unapproved",
          cancelable: !["succeeded", "failed", "canceled"].includes(status),
          reappliable: ["succeeded", "failed", "canceled"].includes(status),
        },
        schedule_after_time:
          status === "scheduled" ? "2026-10-24T09:00:00Z" : null,
        schedule_before_time:
          status === "scheduled" ? "2026-10-24T10:00:00Z" : null,
      };
    }),
);

activityDemoGroups.push(
  ...[false, true].map((hasOutput, index): ActivityGroup => ({
    ...SNAP_ACTION_ACTIVITY,
    actions: undefined,
    id: GROUP_ID + GROUP_COUNT + index,
    summary: `Demo empty group ${hasOutput ? "with" : "without"} output`,
    activity_status: "succeeded",
    result_text: hasOutput
      ? "No matching instances. No child activities were created."
      : null,
  })),
);

export const activityDemoUsers: User[] = users.map((user, index) => ({
  ...user,
  pending_activity: usersWithPendingActivities[index]?.pending_activity ?? null,
}));

activityDemoChildren.push(
  {
    ...base,
    id: CHILD_ID - 1,
    parent_id: GROUP_ID + 2,
    computer_id: 1,
    computer_title: "Application Server 1",
    summary: "Demo completed activity without available actions or output",
    activity_status: "succeeded",
    creation_time: creationTime,
    completion_time: "2026-10-23T09:05:00Z",
    result_text: null,
    actions: undefined,
  },
  ...activityDemoUsers.flatMap((user): Activity[] =>
    user.pending_activity
      ? [
          {
            ...base,
            id: user.pending_activity.activity_id,
            summary: user.pending_activity.summary,
            activity_status: user.pending_activity.activity_status,
            type:
              user.pending_activity.operation === "delete"
                ? "RemoveUserRequest"
                : `${user.pending_activity.operation === "unlock" ? "Unlock" : "Lock"}UserRequest`,
            parent_id: GROUP_ID,
            computer_id: 1,
            computer_title: "Application Server 1",
            creation_time: creationTime,
            result_text: null,
            actions: {
              approvable: false,
              cancelable: true,
              reappliable: false,
            },
          },
        ]
      : [],
  ),
);
