import { ActivityStatus } from "@/types/Activity";
import classes from "./activities.module.scss";

export const ACTIVITY_STATUSES: Record<
  ActivityStatus,
  { icon: string; label: string }
> = {
  succeeded: {
    icon: "success",
    label: "Succeeded",
  },
  scheduled: {
    icon: "spinner",
    label: "Scheduled",
  },
  waiting: {
    icon: "status-waiting",
    label: "Waiting",
  },
  undelivered: {
    icon: "status-queued",
    label: "Queued",
  },
  delivered: {
    icon: "status-in-progress",
    label: "In progress",
  },
  blocked: {
    icon: `warning-grey ${classes.iconWarningRed}`,
    label: "Blocked",
  },
  unapproved: {
    icon: `warning-grey ${classes.iconWarning}`,
    label: "Unapproved",
  },
  canceled: {
    icon: "error-grey",
    label: "Cancelled",
  },
  failed: {
    icon: `error-grey ${classes.iconError}`,
    label: "Failed",
  },
};
