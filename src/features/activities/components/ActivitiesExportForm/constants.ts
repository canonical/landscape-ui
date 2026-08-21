import type { ExportFieldGroup, ExportFormValues } from "@/features/exports";
import { INPUT_DATE_FORMAT } from "@/constants";
import date from "@/libs/date";

const VISIBLE_COLUMN_FIELD_IDS: string[] = [
  "summary",
  "status",
  "computer_id",
  "creation_time",
  "creator",
];

export const INITIAL_VALUES: ExportFormValues = {
  name: "",
  selectedFieldIds: VISIBLE_COLUMN_FIELD_IDS,
  retainUntil: date().add(3, "years").format(INPUT_DATE_FORMAT),
};

export const EXPORT_FIELD_GROUPS: readonly ExportFieldGroup[] = [
  {
    title: "Primary Identity",
    key: "primary-identity",
    fields: [
      { id: "id", label: "ID" },
      { id: "type", label: "Type" },
      { id: "summary", label: "Summary" },
      { id: "status", label: "Status" },
    ],
  },
  {
    title: "Target & Progress",
    key: "target-progress",
    fields: [
      { id: "computer_id", label: "Computer ID" },
      { id: "progress", label: "Progress" },
    ],
  },
  {
    title: "Outcome Details",
    key: "outcome-details",
    fields: [
      { id: "result_code", label: "Result code" },
      { id: "result_text", label: "Result text" },
    ],
  },
  {
    title: "Audit & Time",
    key: "audit-time",
    fields: [
      { id: "creator", label: "Creator" },
      { id: "creation_time", label: "Creation time" },
      { id: "schedule_after_time", label: "Schedule after time" },
      { id: "schedule_before_time", label: "Schedule before time" },
      { id: "modification_time", label: "Modification time" },
      { id: "completion_time", label: "Completion time" },
    ],
  },
  {
    title: "Context & Metadata",
    key: "context-metadata",
    fields: [
      { id: "access_group", label: "Access group" },
      { id: "account_id", label: "Account ID" },
      { id: "parent_id", label: "Parent ID" },
    ],
  },
];
