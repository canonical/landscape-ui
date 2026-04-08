export interface AlertSummary {
  id: number;
  alert_type: string;
  summary: string;
  activation_time: string;
}

export interface AlertSummaryResponse {
  alerts_summary: AlertSummary[];
}
