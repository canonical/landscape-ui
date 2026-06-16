import type { ExportFieldGroup, ActivitiesExportFormValues } from "./types";
import { INPUT_DATE_FORMAT } from "@/constants";
import moment from "moment";
import * as Yup from "yup";

export const INITIAL_VALUES: ActivitiesExportFormValues = {
  name: "",
  selectedFieldIds: [],
  retainUntil: moment().add(3, "years").format(INPUT_DATE_FORMAT),
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().trim().required("This field is required."),
  selectedFieldIds: Yup.array()
    .of(Yup.string().required())
    .min(1, "Select at least one attribute."),
  retainUntil: Yup.string()
    .required("This field is required.")
    .test(
      "retain-until-future",
      "Must be a date in the future.",
      (value) => !!value && moment(value).isAfter(moment().startOf("day")),
    )
    .test(
      "retain-until-max",
      "Must be within 100 years from today.",
      (value) =>
        !!value && moment(value).isSameOrBefore(moment().add(100, "years")),
    ),
});

export const EXPORT_FIELD_GROUPS: readonly ExportFieldGroup[] = [
  {
    title: "Primary Identity",
    key: "primary-identity",
    fields: [
      { id: "id", label: "ID", defaultSelected: true },
      { id: "type", label: "Type", defaultSelected: true },
      { id: "summary", label: "Summary", defaultSelected: true },
      { id: "status", label: "Status", defaultSelected: true },
    ],
  },
  {
    title: "Target & Progress",
    key: "target-progress",
    fields: [
      { id: "computer_id", label: "Computer ID", defaultSelected: true },
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
      { id: "creator", label: "Creator", defaultSelected: true },
      { id: "creation_time", label: "Creation time", defaultSelected: true },
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
