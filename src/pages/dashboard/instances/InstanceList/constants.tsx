type Icon = { gray: string; color?: string } | { gray?: string; color: string };

export type Status = {
  icon: Icon;
  filterValue: string;
  alertType: string;
  label: string;
  query: string;
  alternateLabel?: string;
};

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
  PendingComputers: {
    alertType: "",
    label: "Pending",
    filterValue: "",
    query: "alert:pending-computers",
    icon: { gray: "pause", color: "pause-color" },
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
