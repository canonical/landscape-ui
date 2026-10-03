import type { EditStaffAccountParams } from "../../api";

export interface FormProps {
  subdomain: string;
  salesforce_account_key: string;
  max_people_count: number | "";
  max_attachment_size: number | "";
}

/** The fields of an account PATCH, without the account's name. */
export type StaffAccountChanges = Omit<EditStaffAccountParams, "name">;

export interface StaffAccountChange {
  label: string;
  from: string;
  to: string;
}
