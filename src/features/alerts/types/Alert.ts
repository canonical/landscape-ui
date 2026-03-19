export interface Alert extends Record<string, unknown> {
  alert_type: string;
  all_computers: boolean;
  description: string;
  label: string;
  scope: "account" | "computer";
  status: string;
  subscribed: boolean;
  tags: string[];
}
