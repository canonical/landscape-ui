import { NO_DATA_TEXT } from "@/components/layout/NoData";
import type { ApiError } from "@/types/api/ApiError";
import { isAxiosError } from "axios";
import type { FormikErrors } from "formik";
import { formatSize, toBytes, toReadableSize } from "@/utils/size";
import { getValidationErrors } from "../../helpers";
import type { StaffAccount } from "../../types";
import type {
  FormProps,
  StaffAccountChange,
  StaffAccountChanges,
} from "./types";

const FIELD_NAMES = [
  "subdomain",
  "salesforce_account_key",
  "max_people_count",
  "max_attachment_size",
] as const satisfies (keyof FormProps)[];

export const getInitialValues = (staffAccount: StaffAccount): FormProps => {
  const { value, unit } = toReadableSize(staffAccount.max_attachment_size);

  return {
    subdomain: staffAccount.subdomain ?? "",
    salesforce_account_key: staffAccount.salesforce_account_key ?? "",
    max_people_count: staffAccount.max_people_count,
    max_attachment_size: value,
    max_attachment_size_unit: unit,
  };
};

/** The fields that differ from the account; an emptied text field clears with `null`. */
export const getChanges = (
  values: FormProps,
  staffAccount: StaffAccount,
): StaffAccountChanges => {
  const changes: StaffAccountChanges = {};

  const subdomain = values.subdomain.trim() || null;
  const salesforceAccountKey = values.salesforce_account_key.trim() || null;

  if (subdomain !== staffAccount.subdomain) {
    changes.subdomain = subdomain;
  }

  if (salesforceAccountKey !== staffAccount.salesforce_account_key) {
    changes.salesforce_account_key = salesforceAccountKey;
  }

  if (
    values.max_people_count !== "" &&
    values.max_people_count !== staffAccount.max_people_count
  ) {
    changes.max_people_count = values.max_people_count;
  }

  if (values.max_attachment_size !== "") {
    const maxAttachmentSize = toBytes({
      value: values.max_attachment_size,
      unit: values.max_attachment_size_unit,
    });

    if (maxAttachmentSize !== staffAccount.max_attachment_size) {
      changes.max_attachment_size = maxAttachmentSize;
    }
  }

  return changes;
};

/** Each change as "from" and "to" text, for the confirmation. */
export const describeChanges = (
  changes: StaffAccountChanges,
  staffAccount: StaffAccount,
): StaffAccountChange[] => {
  const described: StaffAccountChange[] = [];

  if (changes.subdomain !== undefined) {
    described.push({
      label: "Subdomain",
      from: staffAccount.subdomain ?? NO_DATA_TEXT,
      to: changes.subdomain ?? NO_DATA_TEXT,
    });
  }

  if (changes.salesforce_account_key !== undefined) {
    described.push({
      label: "Salesforce account key",
      from: staffAccount.salesforce_account_key ?? NO_DATA_TEXT,
      to: changes.salesforce_account_key ?? NO_DATA_TEXT,
    });
  }

  if (changes.max_people_count !== undefined) {
    described.push({
      label: "Administrator limit",
      from: String(staffAccount.max_people_count),
      to: String(changes.max_people_count),
    });
  }

  if (changes.max_attachment_size !== undefined) {
    described.push({
      label: "Attachment size limit",
      from: formatSize(staffAccount.max_attachment_size),
      to: formatSize(changes.max_attachment_size),
    });
  }

  return described;
};

/**
 * The fields a rejected PATCH is about. Validation errors name their field;
 * the Salesforce key and subdomain rejections only carry a message.
 */
export const getFieldErrors = (error: unknown): FormikErrors<FormProps> => {
  const fieldErrors: FormikErrors<FormProps> = getValidationErrors(
    error,
    FIELD_NAMES,
  );

  // A validation error's message is about the body as a whole, never a field.
  if (
    !isAxiosError<ApiError & { detail?: unknown }>(error) ||
    Array.isArray(error.response?.data.detail)
  ) {
    return fieldErrors;
  }

  const message = error.response?.data.message;

  if (typeof message !== "string") {
    return fieldErrors;
  }

  if (/salesforce/i.test(message)) {
    fieldErrors.salesforce_account_key = message.trim();
  } else if (/subdomain/i.test(message)) {
    fieldErrors.subdomain = message.trim();
  }

  return fieldErrors;
};
