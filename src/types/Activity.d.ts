import { Creator } from "./Creator";

export interface ActivityCommon extends Record<string, unknown> {
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

export interface Activity extends ActivityCommon {
  approval_time: string | null;
  children: Activity[];
  computer_id: number;
  deliver_after_time: string | null;
  deliver_before_time: string | null;
  delivery_time: string | null;
  modification_time: string;
  schedule_after_time: string | null;
  schedule_before_time: string | null;
}
