import { ListFilter } from "@/types/Filters";

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
};

export const STATUS_FILTER: ListFilter = {
  label: "Status",
  type: "select",
  options: [
    { label: "All", value: "" },
    {
      label: "Up to date",
      value: "up-to-date",
    },
    {
      label: "Package upgrades",
      value: "package-upgrades",
    },
    {
      label: "Security upgrades",
      value: "security-upgrades",
    },
    {
      label: "Package profiles",
      value: "package-profiles",
    },
    {
      label: "Package reporter",
      value: "package-reporter",
    },
    {
      label: "ESM disabled",
      value: "esm-disabled",
    },
    {
      label: "Computer offline",
      value: "computer-offline",
    },
    {
      label: "Computer online",
      value: "computer-online",
    },
    {
      label: "Computer reboot",
      value: "computer-reboot",
    },
    {
      label: "Computer duplicates",
      value: "computer-duplicates",
    },
    {
      label: "Unapproved activities",
      value: "unapproved-activities",
    },
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
