import type { ColumnFilterOption } from "@/components/form/ColumnFilter";

/** The list's columns as the column picker offers them; the name always shows. */
export const SUPPORT_INSTANCE_COLUMN_OPTIONS: readonly ColumnFilterOption[] = [
  { value: "title", label: "Instance name", canBeHidden: false },
  { value: "upgrades", label: "Upgrades", canBeHidden: true },
  { value: "status", label: "Status", canBeHidden: true },
  { value: "os", label: "OS", canBeHidden: true },
  { value: "tags", label: "Tags", canBeHidden: true },
  { value: "availability_zone", label: "Availability zone", canBeHidden: true },
  { value: "ubuntu_pro", label: "Ubuntu pro", canBeHidden: true },
  { value: "last_ping_time", label: "Last ping", canBeHidden: true },
];
