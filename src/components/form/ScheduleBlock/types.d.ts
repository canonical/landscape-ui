export interface ScheduleBlockFormProps {
  day_of_month_type: "day-of-month" | "day-of-week";
  days: ("SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA")[];
  every: number;
  end_date: string;
  end_type: "never" | "on-a-date";
  months: (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)[];
  start_date: string;
  start_type: "on-a-date" | "recurring";
  unit_of_time: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}
