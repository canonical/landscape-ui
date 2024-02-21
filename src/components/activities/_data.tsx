import { ReactElement } from "react";
import { ActivityStatus } from "@/types/Activity";
import { SelectOption } from "@/types/SelectOption";
import classes from "./Activities.module.scss";

export const ACTIVITY_SEARCH_HELP_TERMS: {
  term: string;
  description: string | ReactElement;
}[] = [
  {
    term: "id:<activity_id>",
    description: "Search for activities with a specific ID.",
  },
  {
    term: "parent-id:<parent_id>",
    description: "Search for children activities of a specific ID.",
  },
  {
    term: "status:<status_name>",
    description: (
      <span>
        Search for activities by status. The available values are{" "}
        <code>undelivered</code>, <code>unapproved</code>,{" "}
        <code>delivered</code>, <code>canceled</code>, <code>failed</code>,{" "}
        <code>succeeded</code>, and <code>scheduled</code>.
      </span>
    ),
  },
  {
    term: "created-after:<date>",
    description: (
      <span>
        Search for activities created after a specific date or time, specified
        with the ISO-8601 format. The precision depends on how far you specify,
        for example <code>2011-01</code>, <code>2011-01-01</code>,{" "}
        <code>2011-01-01T10:30</code> are valid values.
      </span>
    ),
  },
  {
    term: "created-before:<date>",
    description:
      "Search for activities created before a specific date or time. The format is the same as created-after.",
  },
  {
    term: "creator:<email>",
    description:
      "Search for activities created by a particular person (specified by email address).",
  },
  {
    term: "computer:<criteria>",
    description:
      "Search for activities related to the given instances. The criteria is itself another query argument to search instances. See Instance Queries for details.",
  },
  {
    term: "type:<type>",
    description: "Search for activities of a specific type.",
  },
];

export const ACTIVITY_STATUSES: Record<
  ActivityStatus,
  { icon: string; label: string }
> = {
  succeeded: {
    icon: "success",
    label: "Succeeded",
  },
  scheduled: {
    icon: "spinner u-animation--spin",
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

export const ACTIVITY_STATUS_OPTIONS: SelectOption[] = Object.entries(
  ACTIVITY_STATUSES,
)
  .filter(([value]) => value !== "unapproved")
  .map(([value, { label }], index) =>
    index > 0
      ? { label, value }
      : [
          { label: "All", value: "" },
          { label, value },
        ],
  )
  .flat();
