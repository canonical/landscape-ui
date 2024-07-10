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

export interface Subscriber extends Record<string, unknown> {
  email: string;
  id: number;
  name: string;
}

export interface AlertSummary {
  id: number;
  alert_type: string;
  summary: string;
  activation_time: string;
}

export interface AlertSummaryResponse {
  alerts_summary: AlertSummary[];
}
