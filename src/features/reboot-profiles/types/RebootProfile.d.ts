export interface RebootProfile extends Record<string, unknown> {
  id: number;
  title: string;
  every: string;
  next_run: string;
  on_days: string[];
  at_hour: number;
  at_minute: number;
  deliver_within: number;
  deliver_delay_window: number;
  access_group: string;
  tags: string[];
  all_computers: boolean;
  num_computers: number;
}
