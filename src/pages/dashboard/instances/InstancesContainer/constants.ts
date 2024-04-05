import { ListFilter } from "@/types/Filters";
import { STATUSES } from "../InstanceStatusLabel/constants";

interface URLStatuses {
  [key: string]: string;
}

export const OS_FILTER: ListFilter = {
  label: "OS",
  type: "select",
  options: [
    { label: "All", value: "" },
    { label: "Ubuntu", value: "NOT distribution:windows" },
    { label: "Windows", value: "distribution:windows" },
  ],
};

export const QUERY_STATUSES: URLStatuses = {
  "": "",
  "up-to-date": "NOT alert:package-upgrades",
  "package-upgrades": "alert:package-upgrades",
  "security-upgrades": "alert:security-upgrades",
  "package-profiles": "alert:package-profiles",
  "package-reporter": "alert:package-reporter",
  "esm-disabled": "alert:esm-disabled",
  "computer-offline": "alert:computer-offline",
  "computer-online": "NOT alert:computer-offline",
  "computer-reboot": "alert:computer-reboot",
  "computer-duplicates": "alert:computer-duplicates",
  "unapproved-activities": "alert:unapproved-activities",
  "pending-computers": "alert:pending-computers",
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
  "PendingComputersAlert",
  "UnapprovedActivitiesAlert",
];

export const STATUS_FILTER: ListFilter = {
  label: "Status",
  type: "select",
  options: [
    { label: "All", value: "" },
    ...Object.values(STATUSES)
      .filter(({ alertType }) => alertTypes.includes(alertType))
      .sort(
        (a, b) =>
          alertTypes.indexOf(a.alertType) - alertTypes.indexOf(b.alertType),
      )
      .map(({ label, filterValue }) => ({
        label,
        value: filterValue,
      })),
  ],
};

export const GROUP_BY_FILTER: ListFilter = {
  label: "Group by",
  type: "select",
  options: [
    { label: "None", value: "" },
    { label: "Parent", value: "parent" },
  ],
};
