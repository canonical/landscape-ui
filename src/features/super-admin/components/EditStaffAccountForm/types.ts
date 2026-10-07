import type { SizeUnit } from "@/utils/size";
import type { EditStaffAccountParams } from "../../api";

export interface FormProps {
  subdomain: string;
  salesforce_account_key: string;
  max_people_count: number | "";
  /** In `max_attachment_size_unit`, not in bytes. */
  max_attachment_size: number | "";
  max_attachment_size_unit: SizeUnit;
}

/** The fields of an account PATCH, without the account's name. */
export type StaffAccountChanges = Omit<EditStaffAccountParams, "name">;

export interface StaffAccountChange {
  label: string;
  from: string;
  to: string;
}
