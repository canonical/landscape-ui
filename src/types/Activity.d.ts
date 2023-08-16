import { Creator } from "./Creator";

export interface Activity {
  activity_status: string;
  completion_time: string | null;
  creation_time: string;
  creator: Creator;
  deliver_delay_window: number;
  id: number;
  parent_id: number | null;
  result_code: number | null;
  result_text: string | null;
  summary: string;
  type: string;
}
