import type { ExportFieldGroup, ExportFormValues } from "@/features/exports";
import { EXPORT_FIELD_GROUPS } from "@/features/instances";
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

export const REPORT_EXPORT_FIELD_GROUPS: readonly ExportFieldGroup[] = [
  {
    title: "Compliance",
    key: "compliance",
    fields: [
      { id: "securely_patched", label: "Securely patched" },
      { id: "covered_by_upgrade_profile", label: "Covered by upgrade profile" },
      { id: "contacted_recently", label: "Contacted in last 5 min" },
      { id: "time_to_patch_days", label: "Time to patch (days)" },
      { id: "upgrade_profile_schedule", label: "Upgrade profile schedule" },
      { id: "resolved_cves", label: "Resolved CVEs" },
      { id: "unresolved_cves", label: "Unresolved CVEs" },
    ],
  },
  ...EXPORT_FIELD_GROUPS,
];

const BUCKET_TIME_PHRASES: Record<BucketKey, string> = {
  "over-60": "more than 60 days",
  "30-60": "30\u201360 days",
  "14-30": "14\u201330 days",
  "2-14": "2\u201314 days",
  "within-2": "fewer than 2 days",
};

export const buildExportDescription = (
  bucket: BucketKey,
  byCve: boolean,
): string => {
  const timePhrase = BUCKET_TIME_PHRASES[bucket];
  const pendingSuffix =
    bucket === "over-60"
      ? ", or have an unapplied USN released within the last 60 days"
      : "";
  const cveSuffix = byCve ? " organized by CVE" : "";
  return `Instances that took ${timePhrase} to apply a USN${pendingSuffix}${cveSuffix}`;
};

export const INITIAL_EXPORT_VALUES: ExportFormValues = {
  name: "",
  selectedFieldIds: [
    "title",
    "hostname",
    "securely_patched",
    "covered_by_upgrade_profile",
    "contacted_recently",
    "time_to_patch_days",
    "upgrade_profile_schedule",
  ],
  retainUntil: moment().add(3, "years").format(INPUT_DATE_FORMAT),
};
