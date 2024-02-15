export interface Invitation extends Record<string, unknown> {
  account: string;
  creation_time: string;
  email: string;
  id: number;
  name: string;
  secure_id: string;
}
