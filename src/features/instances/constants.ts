import type { ListFilter } from "@/types/Filters";
import type { SelectOption } from "@/types/SelectOption";
import type { Status } from "./types";

export const STATUS_FILTERS = {
  Online: {
    alertType: "ComputerOnlineAlert",
    label: "Online instances",
    alternateLabel: "Online",
    filterValue: "computer-online",
    query: "NOT alert:computer-offline",
    icon: {
      gray: "connected",
      color: "connected-color",
    },
  },
  ComputerDuplicateAlert: {
    alertType: "ComputerDuplicateAlert",
    label: "Duplicate instances",
    alternateLabel: "Duplicate",
    filterValue: "computer-duplicates",
    query: "alert:computer-duplicates",
    icon: { gray: "canvas", color: "canvas-color" },
  },
  ComputerOfflineAlert: {
    alertType: "ComputerOfflineAlert",
    label: "Offline instances",
    alternateLabel: "Offline",
    filterValue: "computer-offline",
    query: "alert:computer-offline",
    icon: { gray: "disconnect", color: "disconnect-color" },
  },
  ComputerRebootAlert: {
    alertType: "ComputerRebootAlert",
    label: "Needs reboot",
    alternateLabel: "Needs reboot",
    filterValue: "computer-reboot",
    query: "alert:computer-reboot",
    icon: {
      gray: "power-off",
      color: "power-off-color",
    },
  },
  EsmDisabledAlert: {
    alertType: "EsmDisabledAlert",
    label: "ESM disabled",
    alternateLabel: "ESM updates are disabled",
    filterValue: "esm-disabled",
    query: "alert:esm-disabled",
    icon: {
      gray: "computer-esm-disabled-alert",
      color: "computer-esm-disabled-alert-color",
    },
  },
  PackageProfilesAlert: {
    alertType: "PackageProfilesAlert",
    label: "Package profile alert",
    alternateLabel: undefined,
    filterValue: "package-profiles",
    query: "alert:package-profiles",
    icon: {
      gray: undefined,
      color: "package-profiles-alert",
    },
  },
  PackageReporterAlert: {
    alertType: "PackageReporterAlert",
    label: "Package reporter alert",
    alternateLabel: undefined,
    filterValue: "package-reporter",
    query: "alert:package-reporter",
    icon: { gray: undefined, color: "package-reporter-alert" },
  },
  PackageUpgradesAlert: {
    alertType: "PackageUpgradesAlert",
    label: "Package upgrades alert",
    alternateLabel: "Regular",
    filterValue: "package-upgrades",
    query: "alert:package-upgrades",
    icon: { gray: undefined, color: "regular-upgrades" },
  },
  SecurityUpgradesAlert: {
    alertType: "SecurityUpgradesAlert",
    label: "Security upgrades alert",
    alternateLabel: "Security",
    filterValue: "security-upgrades",
    query: "alert:security-upgrades",
    icon: { gray: undefined, color: "security-upgrades" },
  },
  UnapprovedActivitiesAlert: {
    alertType: "UnapprovedActivitiesAlert",
    label: "Unapproved activities alert",
    alternateLabel: undefined,
    filterValue: "unapproved-activities",
    query: "alert:unapproved-activities",
    icon: { gray: "status-queued", color: undefined },
  },
  UpToDate: {
    alertType: "UpToDate",
    label: "Packages up to date",
    alternateLabel: "Up to date",
    filterValue: "up-to-date",
    query: "NOT alert:package-upgrades",
    icon: { gray: undefined, color: "up-to-date" },
  },
  ChildInstanceProfileAlert: {
    alertType: "ChildInstanceProfileAlert",
    label: "WSL profile alert",
    alternateLabel: "WSL profile alert",
    filterValue: "child-instance-profiles",
    query: "alert:child-instance-profiles",
    icon: { gray: "machines", color: undefined },
  },
} satisfies Record<string, Status>;

export const ALERT_STATUSES = {
  ...STATUS_FILTERS,
  PendingComputersAlert: {
    alertType: "PendingComputersAlert",
    label: "Pending acceptance",
    alternateLabel: "Pending",
    filterValue: "",
    query: "",
    icon: { gray: "pause", color: "pause-color" },
  },
  UbuntuProContractExpirationAlert: {
    alertType: "UbuntuProContractExpirationAlert",
    label: "Ubuntu Pro contract expiring",
    alternateLabel: "Ubuntu Pro expiring",
    filterValue: "90",
    query: "contract-expires-within-days:90",
    icon: { gray: undefined, color: "contract-expiration-alert" },
  },
  Unknown: {
    alertType: "",
    label: "-",
    alternateLabel: "-",
    filterValue: "",
    query: "",
    icon: { gray: undefined, color: "package-profiles-alert" },
  },
} satisfies Record<string, Status>;

const ARCHIVED_STATUS_OPTION: SelectOption = {
  label: "Archived",
  value: "archived",
};

type FilterKey = "os" | "groupBy" | "status" | "wsl" | "contractExpiryDays";

export const FILTERS = {
  os: {
    slug: "os",
    label: "OS",
    type: "select",
    options: [
      { label: "All", value: "", query: "" },
      { label: "Ubuntu", value: "ubuntu", query: "NOT distribution:windows" },
      { label: "Windows", value: "windows", query: "distribution:windows" },
    ],
  },
  groupBy: {
    slug: "groupBy",
    label: "Group by",
    type: "select",
    options: [
      { label: "None", value: "" },
      { label: "Parent", value: "parent" },
    ],
  },
  status: {
    slug: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "All", value: "", query: "" },
      ...Object.values(STATUS_FILTERS)
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(({ label, filterValue, query }) => ({
          label,
          value: filterValue,
          query,
        })),
      ARCHIVED_STATUS_OPTION,
    ],
  },
  wsl: {
    slug: "wsl",
    label: "WSL",
    type: "multi-select",
    options: [
      { label: "Parent", value: "parent", query: "wsl:parent" },
      { label: "Child", value: "child", query: "wsl:child" },
    ],
  },
  contractExpiryDays: {
    slug: "contractExpiryDays",
    label: "Contract expiry",
    type: "select",
    options: [
      { label: "All", value: "", query: "" },
      {
        label: "90 days",
        value: "90",
        query: "contract-expires-within-days:90",
      },
      {
        label: "60 days",
        value: "60",
        query: "contract-expires-within-days:60",
      },
      {
        label: "30 days",
        value: "30",
        query: "contract-expires-within-days:30",
      },
      {
        label: "7 days",
        value: "7",
        query: "contract-expires-within-days:7",
      },
    ],
  },
} as const satisfies Record<FilterKey, ListFilter>;
