export interface ScheduleBlockFormProps {
  every: number;
  end_date: string;
  end_type: "never" | "on-a-date";
  on: string[];
  start_date: string;
  start_type: "on-a-date" | "recurring" | "";
  unit_of_time: string;
}
