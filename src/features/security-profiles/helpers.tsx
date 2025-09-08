import { ordinal } from "@/components/form/ScheduleBlock/components/ScheduleBlockBase/helpers";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT, INPUT_DATE_TIME_FORMAT } from "@/constants";
import type { NotificationHelper } from "@/types/Notification";
import { Icon, Tooltip } from "@canonical/react-components";
import moment from "moment";
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "./constants";
import classes from "./helpers.module.scss";
import type { SecurityProfile } from "./types";
import type { SecurityProfileFormValues } from "./types/SecurityProfileAddFormValues";

export const phrase = (strings: string[] = []) => {
  return `${strings.slice(0, -1).join(", ")}${strings.length > 2 ? "," : ""}${strings.length > 1 ? " and " : ""}${strings.slice(-1)}`;
};

export const notifyCreation = (
  values: SecurityProfileFormValues,
  notify: NotificationHelper,
) => {
  const notificationMessageParts = ["perform an initial run"];

  if (values.mode != "audit") {
    notificationMessageParts.push(
      "apply remediation fixes on associated instances",
    );
  }

  if (values.mode == "audit-fix-restart") {
    notificationMessageParts.push("restart them");
  }

  notificationMessageParts.push("generate an audit");

  notify.success({
    title: `You have successfully created ${values.title} security profile.`,
    message: `This profile will ${phrase(notificationMessageParts)}.`,
  });
};

export const getTags = (profile: SecurityProfile) =>
  profile.all_computers
    ? "All instances"
    : profile.tags.join(", ") || <NoData />;

export const getTailoringFile = (profile: SecurityProfile) => {
  if (!profile.tailoring_file_uri) {
    return <NoData />;
  }

  const match = profile.tailoring_file_uri.match(/[^/]+$/);

  return (
    <div className={classes.container}>
      <div className={classes.truncated}>
        {match ? match[0] : "tailoring-file.xml"}
      </div>

      <a href={profile.tailoring_file_uri} download>
        <Icon name="begin-downloading" />
      </a>
    </div>
  );
};

export const getSchedule = (profile: SecurityProfile) => {
  const schedule = Object.fromEntries(
    profile.schedule.split(";").map((part) => part.split("=")),
  );

  const sliceEndIdx = -2;

  if (schedule.COUNT == 1) {
    return "On a date";
  }

  let scheduleText = "Recurring, every ";

  if (schedule.INTERVAL > 1) {
    scheduleText += `${schedule.INTERVAL} `;
  }

  scheduleText += {
    DAILY: "day",
    WEEKLY: "week",
    MONTHLY: "month",
    YEARLY: "year",
  }[schedule.FREQ as string];

  if (schedule.INTERVAL > 1) {
    scheduleText += "s";
  }

  switch (schedule.FREQ) {
    case "WEEKLY": {
      scheduleText += ` on ${phrase(schedule.BYDAY.split(",").map((day: string) => ({ SU: "Sunday", MO: "Monday", TU: "Tuesday", WE: "Wednesday", TH: "Thursday", FR: "Friday", SA: "Saturday" })[day]))}`;
      break;
    }

    case "MONTHLY": {
      scheduleText += " on the ";

      if (schedule.BYMONTHDAY) {
        scheduleText += `${ordinal(schedule.BYMONTHDAY)} day`;
        break;
      }

      if (schedule.BYDAY) {
        scheduleText += `${
          {
            "1": "first",
            "2": "second",
            "3": "third",
            "4": "fourth",
            "-1": "last",
          }[(schedule.BYDAY as string).slice(0, sliceEndIdx)]
        } ${{ SU: "Sunday", MO: "Monday", TU: "Tuesday", WE: "Wednesday", TH: "Thursday", FR: "Friday", SA: "Saturday" }[(schedule.BYDAY as string).slice(sliceEndIdx)]}`;
      }

      break;
    }

    case "YEARLY": {
      scheduleText += ` in ${phrase(
        schedule.BYMONTH.split(",")
          .toSorted((a: number, b: number) => a - b)
          .map(
            (month: number) =>
              ({
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "Novebmer",
                12: "December",
              })[month],
          ),
      )}`;
      break;
    }
  }

  if (schedule.UNTIL) {
    scheduleText += ` until ${moment(schedule.UNTIL).format(DISPLAY_DATE_TIME_FORMAT)}`;
  }

  return scheduleText;
};

export const getStatus = (profile: SecurityProfile) => {
  if (profile.status === "archived") {
    return { label: "Archived", icon: "status-queued-small" };
  }

  if (
    profile.associated_instances > SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT
  ) {
    return {
      label: (
        <div className={classes.statusWithIcon}>
          <span>Over limit</span>
          <Tooltip
            position="top-center"
            message="Only the first 5,000 instances are covered. Instances beyond the limit are not covered."
          >
            <div className={classes.tooltipIcon}>
              <i className="p-icon--help" />
            </div>
          </Tooltip>
        </div>
      ),
      icon: "status-failed-small",
    };
  }

  return { label: "Active", icon: "status-succeeded-small" };
};

export const getInitialValues = (
  profile: SecurityProfile,
): SecurityProfileFormValues => {
  const schedule = Object.fromEntries(
    profile.schedule.split(";").map((part) => part.split("=")),
  );

  return {
    day_of_month_type:
      schedule.FREQ == "MONTHLY" && schedule.BYDAY
        ? "day-of-week"
        : "day-of-month",
    days:
      schedule.FREQ == "WEEKLY" && schedule.BYDAY
        ? schedule.BYDAY.split(",")
        : [],
    delivery_time: profile.restart_deliver_delay ? "delayed" : "asap",
    end_date: schedule.UNTIL
      ? moment(schedule.UNTIL).format(INPUT_DATE_TIME_FORMAT)
      : moment().format(INPUT_DATE_TIME_FORMAT),
    end_type: schedule.UNTIL ? "on-a-date" : "never",
    every: schedule.INTERVAL,
    months:
      schedule.FREQ == "YEARLY" && schedule.BYMONTH
        ? schedule.BYMONTH.split(",").map((month: string) => Number(month))
        : [],
    randomize_delivery: profile.restart_deliver_delay_window ? "yes" : "no",
    start_date: moment(
      profile.next_run_time ?? profile.last_run_results.timestamp,
    ).format(INPUT_DATE_TIME_FORMAT),
    start_type: schedule.COUNT == 1 ? "on-a-date" : "recurring",
    tailoring_file: null,
    unit_of_time: schedule.FREQ || "DAILY",
    ...profile,
  };
};

export const getNotificationMessage = (
  mode: "audit" | "audit-fix" | "audit-fix-restart",
) => {
  switch (mode) {
    case "audit-fix-restart":
      return "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.";
    case "audit":
      return "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.";
    default:
      return "Applying remediation fixes and generating an audit have been queued in Activities.";
  }
};
