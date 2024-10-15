import { ListFilter } from "@/types/Filters";
import { Status } from "./types/Status";

export const STATUSES: { [keyof: string]: Status } = {
  Online: {
    alertType: "ComputerOnlineAlert",
    label: "Computers online",
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
    label: "Computer duplicates",
    alternateLabel: "Duplicate",
    filterValue: "computer-duplicates",
    query: "alert:computer-duplicates",
    icon: { gray: "canvas", color: "canvas-color" },
  },
  ComputerOfflineAlert: {
    alertType: "ComputerOfflineAlert",
    label: "Computers offline",
    alternateLabel: "Offline",
    filterValue: "computer-offline",
    query: "alert:computer-offline",
    icon: { gray: "disconnect", color: "disconnect-color" },
  },
  ComputerRebootAlert: {
    alertType: "ComputerRebootAlert",
    label: "Computer reboot",
    alternateLabel: "Reboot required",
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
    label: "Package profiles",
    filterValue: "package-profiles",
    query: "alert:package-profiles",
    icon: {
      color: "package-profiles-alert",
    },
  },
  PackageReporterAlert: {
    alertType: "PackageReporterAlert",
    label: "Package reporter",
    filterValue: "package-reporter",
    query: "alert:package-reporter",
    icon: { color: "package-reporter-alert" },
  },
  PackageUpgradesAlert: {
    alertType: "PackageUpgradesAlert",
    label: "Package upgrades",
    alternateLabel: "Regular",
    filterValue: "package-upgrades",
    query: "alert:package-upgrades",
    icon: { color: "regular-upgrades" },
  },
  SecurityUpgradesAlert: {
    alertType: "SecurityUpgradesAlert",
    label: "Security upgrades",
    alternateLabel: "Security",
    filterValue: "security-upgrades",
    query: "alert:security-upgrades",
    icon: { color: "security-upgrades" },
  },
  UnapprovedActivitiesAlert: {
    alertType: "UnapprovedActivitiesAlert",
    label: "Unapproved activities",
    filterValue: "unapproved-activities",
    query: "alert:unapproved-activities",
    icon: { gray: "status-queued" },
  },
  UpToDate: {
    alertType: "UpToDate",
    label: "Up to date",
    alternateLabel: "Up to date",
    filterValue: "up-to-date",
    query: "NOT alert:package-upgrades",
    icon: { color: "up-to-date" },
  },
  PendingComputersAlert: {
    alertType: "PendingComputersAlert",
    label: "Pending",
    alternateLabel: "Pending",
    filterValue: "",
    query: "",
    icon: { gray: "pause", color: "pause-color" },
  },
  ChildInstanceProfileAlert: {
    alertType: "ChildInstanceProfileAlert",
    label: "Child instance profiles",
    alternateLabel: "Child instance profiles",
    filterValue: "child-instance-profiles",
    query: "alert:child-instance-profiles",
    icon: { gray: "machines" },
  },
  Unknown: {
    alertType: "",
    label: "-",
    alternateLabel: "-",
    filterValue: "",
    query: "",
    icon: { color: "package-profiles-alert" },
  },
};

const alertTypes = [
  "UpToDate",
  "PackageUpgradesAlert",
  "SecurityUpgradesAlert",
  "PackageProfilesAlert",
  "PackageReporterAlert",
  "EsmDisabledAlert",
  "ComputerOfflineAlert",
  "ComputerOnlineAlert",
  "ComputerRebootAlert",
  "ComputerDuplicateAlert",
  "UnapprovedActivitiesAlert",
  "ChildInstanceProfileAlert",
];

type FilterKey = "os" | "groupBy" | "status";

export const FILTERS: { [key in FilterKey]: ListFilter } = {
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
      ...Object.values(STATUSES)
        .filter(({ alertType }) => alertTypes.includes(alertType))
        .sort(
          (a, b) =>
            alertTypes.indexOf(a.alertType) - alertTypes.indexOf(b.alertType),
        )
        .map(({ label, filterValue, query }) => ({
          label,
          value: filterValue,
          query,
        })),
    ],
  },
};
