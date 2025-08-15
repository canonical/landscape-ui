import { parseSchedule } from "../../helpers";
import type { RebootProfile } from "../../types";

const WEEKDAY_MAP: Record<string, string> = {
  mo: "Monday",
  tu: "Tuesday",
  we: "Wednesday",
  th: "Thursday",
  fr: "Friday",
  sa: "Saturday",
  su: "Sunday",
};

const concatenateDays = (days: string[]): string => {
  if (days.length === 2) return `${days[0]} and ${days[1]}`;
  if (days.length > 2)
    return `${days.slice(0, -1).join(", ")}, and ${days[days.length - 1]}`;
  return days[0] ?? "";
};

export const formatWeeklyRebootSchedule = (profile: RebootProfile): string => {
  const { freq, on_days } = parseSchedule(profile.schedule);

  if (freq !== "weekly" || !on_days.length) {
    return "One-time";
  }

  const days = on_days.map((code) => WEEKDAY_MAP[code.toLowerCase()]);
  const readableDays = concatenateDays(days);

  return `Every week on ${readableDays}`;
};
