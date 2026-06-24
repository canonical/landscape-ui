import type { ExportFormValues } from "@/features/exports";
import { INITIAL_VALUES } from "./constants";

const ACCESSOR_TO_EXPORT_FIELD_ID: Record<string, string | string[]> = {
  title: "title",
  status: "status",
  upgrades: ["upgrades_security", "upgrades_regular"],
  os: "os",
  tags: "tags",
  availability_zone: "availability_zone",
  ubuntu_pro: "ubuntu_pro",
  last_ping_time: "last_ping_time",
};

export const getInitialValues = (
  disabledColumns: string[],
): ExportFormValues => ({
  ...INITIAL_VALUES,
  selectedFieldIds: Object.entries(ACCESSOR_TO_EXPORT_FIELD_ID)
    .filter(([accessor]) => !disabledColumns.includes(accessor))
    .flatMap(([, value]) => (Array.isArray(value) ? value : [value])),
});
