export interface Alert extends Record<string, unknown> {
  alert_type: string;
  all_computers: boolean;
  description: string;
  label: string;
  scope: string;
  status: string;
  subscribed: boolean;
  tags: string[];
}
