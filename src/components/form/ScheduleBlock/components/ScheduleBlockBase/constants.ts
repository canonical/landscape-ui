import type { ScheduleBlockFormProps } from "../../types";

export const DAY_OPTIONS = [
  { label: "Sundays", value: "SU" },
  { label: "Mondays", value: "MO" },
  { label: "Tuesdays", value: "TU" },
  { label: "Wednesdays", value: "WE" },
  { label: "Thursdays", value: "TH" },
  { label: "Fridays", value: "FR" },
  { label: "Saturdays", value: "SA" },
] as const satisfies {
  label: string;
  value: ScheduleBlockFormProps["days"][number];
}[];

export const MONTH_OPTIONS: readonly {
  label: string;
  value: ScheduleBlockFormProps["months"][number];
}[] = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
