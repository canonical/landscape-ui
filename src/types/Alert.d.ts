export interface Alert extends Record<string, unknown> {
  alert_type: string;
  all_computers: boolean;
  description: string;
  scope: string;
  status: string;
  subscribed: boolean;
  tags: string[];
}

export interface Subscriber extends Record<string, unknown> {
  email: string;
  name: string;
  id: number;
}
