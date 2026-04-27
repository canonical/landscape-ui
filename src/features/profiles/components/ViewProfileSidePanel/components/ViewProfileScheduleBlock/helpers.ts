import { hasProperty, pluralizeWithCount } from "@/utils/_helpers";
import {
  getTriggerText,
  isRebootProfile,
  isScriptProfile,
  isSecurityProfile,
  isUpgradeProfile,
} from "../../../../helpers";
import type { Profile } from "../../../../types";
import type { UpgradeProfile } from "@/features/upgrade-profiles";
import type { RebootProfile } from "@/features/reboot-profiles";
import { getSecuritySchedule } from "@/features/security-profiles";

const WEEKDAY_MAP = {
  mo: "Monday",
  tu: "Tuesday",
  we: "Wednesday",
  th: "Thursday",
  fr: "Friday",
  sa: "Saturday",
  su: "Sunday",
};

const getScheduledDays = (onDays: string[]) => {
  if (onDays.length === 7) {
    return "Every day";
  }
  return onDays
    .map((code) => code.toLowerCase())
    .filter((value) => hasProperty(WEEKDAY_MAP, value))
    .map((code) => WEEKDAY_MAP[code])
    .join(", ");
};

const getUpgradeSchedule = (profile: UpgradeProfile) => {
  const { at_hour, every, on_days } = profile;

  let scheduleMessage = "Every ";

  const atMinute = parseInt(profile.at_minute);

  if (every === "hour") {
    scheduleMessage += `hour at ${pluralizeWithCount(atMinute, "minute")}`;

    if (on_days) {
      scheduleMessage += ` on ${getScheduledDays(on_days)}`;
    }
  }

  if (every === "week") {
    if (!on_days || !at_hour) {
      return "Every week";
    }

    const atHour = parseInt(at_hour);

    scheduleMessage += `${getScheduledDays(on_days)} at ${atHour > 9 ? atHour : `0${atHour}`}:${atMinute > 9 ? atMinute : `0${atMinute}`} UTC`;
  }

  return scheduleMessage;
};

const parseSchedule = (schedule: string) => {
  const map = new Map(
    schedule.split(";").map((part) => {
      const [key, value] = part.split("=", 2) as [string, string | undefined];

      return [key.toUpperCase(), value];
    }),
  );

  const freq = map.get("FREQ")?.toLowerCase() ?? "";
  const at_hour = parseInt(map.get("BYHOUR") ?? "");
  const at_minute = parseInt(map.get("BYMINUTE") ?? "");
  const on_days = (map.get("BYDAY") ?? "").split(",");

  return {
    freq,
    at_hour,
    at_minute,
    on_days,
  };
};

const getRebootSchedule = (profile: RebootProfile): string => {
  const { freq, on_days, at_hour, at_minute } = parseSchedule(profile.schedule);

  if (freq !== "weekly" || !on_days.length) {
    return "One-time";
  }

  const days = getScheduledDays(on_days);

  return `${days} at ${at_hour}:${at_minute} UTC`;
};

export const getScheduleMessage = (profile: Profile) => {
  if (isRebootProfile(profile)) {
    return getRebootSchedule(profile);
  }
  if (isUpgradeProfile(profile)) {
    return getUpgradeSchedule(profile);
  }
  if (isSecurityProfile(profile)) {
    return getSecuritySchedule(profile);
  }
  if (isScriptProfile(profile)) {
    return getTriggerText(profile, true);
  }
};

export const getLastRunData = (profile: Profile) => {
  if (isScriptProfile(profile)) {
    return profile.activities.last_activity?.creation_time ?? null;
  }
  if (isSecurityProfile(profile)) {
    return profile.last_run_results.timestamp;
  }
  return null;
};

export const getNextRunData = (profile: Profile) => {
  if (isScriptProfile(profile) && profile.trigger.trigger_type !== "event") {
    return profile.trigger.next_run;
  }
  if (isSecurityProfile(profile)) {
    return profile.next_run_time;
  }
  if (isRebootProfile(profile) || isUpgradeProfile(profile)) {
    return profile.next_run;
  }
  return null;
};
