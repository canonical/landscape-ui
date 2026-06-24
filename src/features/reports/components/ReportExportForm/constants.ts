import type { ExportFormValues } from "@/features/exports";
import { INPUT_DATE_FORMAT } from "@/constants";
import moment from "moment";

export const BUCKET_OPTIONS = [
  { value: "over-60", label: "60+ days outstanding" },
  { value: "30-60", label: "30–60 days" },
  { value: "14-30", label: "14–30 days" },
  { value: "2-14", label: "2–14 days" },
  { value: "within-2", label: "Within 2 days" },
] as const;

export type BucketKey = (typeof BUCKET_OPTIONS)[number]["value"];

export const INITIAL_EXPORT_VALUES: ExportFormValues = {
  name: "",
  selectedFieldIds: [],
  retainUntil: moment().add(3, "years").format(INPUT_DATE_FORMAT),
};
