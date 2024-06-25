import moment from "moment";
import { UpgradeProfile, UpgradeProfileDay } from "../types";
import { DAY_OPTIONS } from "../constants";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";

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
    scheduleMessage += `hour at ${atMinute} ${atMinute !== 1 ? "minutes" : "minute"}`;

    if (on_days) {
      scheduleMessage += ` on ${getScheduledDays(on_days)}`;
    }
  }

  if (every === "week") {
    if (!on_days || !at_hour) {
      return { scheduleMessage: "Every week", nextRunMessage };
    }

    const atHour = parseInt(at_hour);

    scheduleMessage += `${getScheduledDays(on_days)} at ${atHour > 9 ? atHour : `0${atHour}`}:${atMinute > 9 ? atMinute : `0${atMinute}`} UTC`;
  }

  return { scheduleMessage, nextRunMessage };
};
