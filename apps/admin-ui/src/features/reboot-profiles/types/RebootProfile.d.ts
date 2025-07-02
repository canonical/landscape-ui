export interface RebootProfile extends Record<string, unknown> {
  id: number;
  title: string;
  next_run: string;
  schedule: string;
  deliver_within: number;
  deliver_delay_window: number;
  access_group: string;
  tags: string[];
  all_computers: boolean;
  num_computers: number;
}
