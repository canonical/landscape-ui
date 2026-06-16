import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { Instance } from "@/types/Instance";
import moment from "moment";

export const EXPORT_ASYNC_THRESHOLD_MS = 1500;

export interface ExportFieldOption {
  readonly id: string;
  readonly label: string;
  readonly defaultSelected?: boolean;
  readonly getValue: (instance: Instance) => string;
}

export interface AnnotationFieldOption extends ExportFieldOption {
  readonly annotationKey: string;
}

const formatDate = (value: string | null | undefined) =>
  moment(value).isValid() ? moment(value).format(DISPLAY_DATE_TIME_FORMAT) : "";

const getStatusLabel = (instance: Instance) => {
  if (instance.archived) {
    return "Archived";
  }

  const filteredAlerts = (instance.alerts ?? []).filter(
    ({ type }) =>
      !["PackageUpgradesAlert", "SecurityUpgradesAlert"].includes(type),
  );

  if (!filteredAlerts.length) {
    return "Online";
  }

  return filteredAlerts.map(({ summary, type }) => summary || type).join("; ");
};

export const BUILTIN_EXPORT_FIELDS: ExportFieldOption[] = [
  {
    id: "title",
    label: "Instance name",
    defaultSelected: true,
    getValue: (instance) => instance.title,
  },
  {
    id: "hostname",
    label: "Hostname",
    defaultSelected: true,
    getValue: (instance) => instance.hostname ?? "",
  },
  {
    id: "status",
    label: "Status",
    defaultSelected: true,
    getValue: getStatusLabel,
  },
  {
    id: "os",
    label: "OS",
    defaultSelected: true,
    getValue: (instance) => instance.distribution_info?.description ?? "",
  },
  {
    id: "access_group",
    label: "Access group",
    defaultSelected: true,
    getValue: (instance) => instance.access_group,
  },
  {
    id: "tags",
    label: "Tags",
    defaultSelected: true,
    getValue: (instance) =>
      instance.tags.length ? JSON.stringify(instance.tags) : "",
  },
  {
    id: "availability_zone",
    label: "Availability zone",
    getValue: (instance) => instance.cloud_init?.availability_zone ?? "",
  },
  {
    id: "ubuntu_pro",
    label: "Ubuntu Pro expiration",
    getValue: (instance) =>
      instance.ubuntu_pro_info?.attached
        ? formatDate(instance.ubuntu_pro_info.expires)
        : "",
  },
  {
    id: "last_ping",
    label: "Last ping",
    defaultSelected: true,
    getValue: (instance) => formatDate(instance.last_ping_time),
  },
  {
    id: "registered_at",
    label: "Registered at",
    getValue: (instance) => formatDate(instance.registered_at),
  },
  {
    id: "parent",
    label: "Parent instance",
    getValue: (instance) => instance.parent?.title ?? "",
  },
  {
    id: "comment",
    label: "Comment",
    getValue: (instance) => instance.comment,
  },
  {
    id: "employee_id",
    label: "Employee ID",
    getValue: (instance) =>
      instance.employee_id === null ? "" : String(instance.employee_id),
  },
  {
    id: "archived",
    label: "Archived",
    getValue: (instance) => (instance.archived ? "Yes" : "No"),
  },
  {
    id: "wsl",
    label: "WSL instance",
    getValue: (instance) => (instance.is_wsl_instance ? "Yes" : "No"),
  },
];

const builtinFieldMap = new Map(
  BUILTIN_EXPORT_FIELDS.map((field) => [field.id, field]),
);

export const DEFAULT_EXPORT_FIELD_IDS = BUILTIN_EXPORT_FIELDS.filter(
  ({ defaultSelected }) => defaultSelected,
).map(({ id }) => id);

export const getAnnotationFieldOptions = (
  instances: Instance[],
): AnnotationFieldOption[] => {
  const annotationKeys = new Set<string>();

  instances.forEach((instance) => {
    Object.keys(instance.annotations ?? {}).forEach((annotationKey) => {
      annotationKeys.add(annotationKey);
    });
  });

  return [...annotationKeys]
    .sort((left, right) => left.localeCompare(right))
    .map((annotationKey) => ({
      id: `annotation:${annotationKey}`,
      label: `Annotation: ${annotationKey}`,
      annotationKey,
      getValue: (instance) => instance.annotations?.[annotationKey] ?? "",
    }));
};

export const getSelectedExportFields = ({
  annotationFieldOptions,
  selectedFieldIds,
}: {
  annotationFieldOptions: AnnotationFieldOption[];
  selectedFieldIds: string[];
}) => {
  const effectiveFieldIds = selectedFieldIds.length
    ? selectedFieldIds
    : DEFAULT_EXPORT_FIELD_IDS;
  const annotationFieldMap = new Map(
    annotationFieldOptions.map((field) => [field.id, field]),
  );

  return effectiveFieldIds.flatMap((fieldId) => {
    const field =
      builtinFieldMap.get(fieldId) ?? annotationFieldMap.get(fieldId);

    return field ? [field] : [];
  });
};

export const buildExportQuery = ({
  query,
  selectedInstanceIds,
}: {
  query?: string;
  selectedInstanceIds?: number[];
}) => {
  if (selectedInstanceIds?.length) {
    return `id:${selectedInstanceIds.join(" OR id:")}`;
  }

  return query?.trim();
};
