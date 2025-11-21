import moment from "moment";
import type { UpgradeProfile, UpgradeProfileDay } from "../../types";
import { DAY_OPTIONS } from "../../constants";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { pluralize } from "@/utils/_helpers";

const getScheduledDays = (onDays: UpgradeProfileDay[]) => {
  return DAY_OPTIONS.filter(({ value }) => onDays.includes(value))
    .sort((a, b) => a.order - b.order)
    .map(({ label }) => label)
    .join(", ")
    .replace(/,(?= \w+$)/, " and");
};

export const getScheduleInfo = (profile: UpgradeProfile) => {
  const { at_hour, deliver_within, every, next_run, on_days } = profile;

  const nextRunMessage = moment(next_run)
    .utc()
    .format(
      `ddd, ${DISPLAY_DATE_TIME_FORMAT} [UTC (expires after ${deliver_within}h)]`,
    );

  let scheduleMessage = "Every ";

  const atMinute = parseInt(profile.at_minute);

  if (every === "hour") {
    scheduleMessage += `hour at ${atMinute} ${pluralize(atMinute, "minute")}`;

    if (on_days) {
      scheduleMessage += ` on ${getScheduledDays(on_days)}`;
    }
  }

  if (every === "week") {
    if (!on_days || !at_hour) {
      return { scheduleMessage: "Every week", nextRunMessage };
    }

    scheduleMessage += `${getScheduledDays(on_days)} at ${moment(next_run).utc().format("HH:mm")} UTC`;
  }

  return { scheduleMessage, nextRunMessage };
};
