interface ScheduleBlockFormPropsBase {
  every: number;
  end_date: string;
  end_type: "never" | "on-a-date";
  start_date: string;
  start_type: "on-a-date" | "recurring" | "";
}

interface DailyScheduleBlockFormProps extends ScheduleBlockFormPropsBase {
  unit_of_time: "days";
}

interface WeeklyScheduleBlockFormProps extends ScheduleBlockFormPropsBase {
  on: (
    | "sundays"
    | "mondays"
    | "tuesdays"
    | "wednesdays"
    | "thursdays"
    | "fridays"
    | "saturdays"
  )[];
  unit_of_time: "weeks";
}

interface MonthlyScheduleBlockFormProps extends ScheduleBlockFormPropsBase {
  on: "day-of-month" | "day-of-week";
  unit_of_time: "months";
}

interface YearlyScheduleBlockFormProps extends ScheduleBlockFormPropsBase {
  on: (
    | "january"
    | "february"
    | "march"
    | "april"
    | "may"
    | "june"
    | "july"
    | "august"
    | "september"
    | "october"
    | "november"
    | "december"
  )[];
  unit_of_time: "years";
}

export type ScheduleBlockFormProps =
  | DailyScheduleBlockFormProps
  | WeeklyScheduleBlockFormProps
  | MonthlyScheduleBlockFormProps
  | YearlyScheduleBlockFormProps;
