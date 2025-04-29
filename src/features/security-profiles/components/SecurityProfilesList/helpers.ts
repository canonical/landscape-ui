import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileFormValues } from "../../types/SecurityProfileAddFormValues";

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
