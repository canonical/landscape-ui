import { ReactElement } from "react";
import { ListFilter } from "@/types/Filters";
import { STATUSES } from "@/pages/dashboard/instances/InstanceList/constants";

export const INSTANCE_SEARCH_HELP_TERMS: {
  term: string;
  description: string | ReactElement;
}[] = [
  {
    term: "<keyword>",
    description: (
      <span>
        Instances with the title or hostname <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "distribution:<keyword>",
    description: (
      <span>
        Instances with the installed distribution named{" "}
        <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "needs:reboot",
    description: "Instances needing a reboot",
  },
  {
    term: "alert:<type>",
    description: (
      <>
        <span>
          Instances with outstanding alerts of the specified{" "}
          <code>&lt;type&gt;</code>
        </span>
        <br />
        <span>
          <code>&lt;type&gt;</code> can be <code>package-upgrades</code>,{" "}
          <code>security-upgrades</code>,<code>package-profiles</code>,{" "}
          <code>package-reporter</code>, <code>esm-disabled</code>,{" "}
          <code>computer-offline</code>,<code>computer-reboot</code>,{" "}
          <code>computer-duplicates</code>, <code>unapproved-activities</code>.
        </span>
      </>
    ),
  },
  {
    term: "ip:<address>",
    description: (
      <>
        <span>
          Instances with IP addresses like <code>&lt;address&gt;</code>
        </span>
        <br />
        <span>
          <code>&lt;address&gt;</code> can be a fragment or partial IP address
          representing a subnet such as 91.185.94 to match any instances in the
          subnet.
        </span>
      </>
    ),
  },
  {
    term: "mac:<address>",
    description: (
      <span>
        Instances with the MAC address <code>&lt;address&gt;</code>
      </span>
    ),
  },
  {
    term: "id:<instance_id>",
    description: (
      <span>
        Instance with the id <code>&lt;instance_id&gt;</code>
      </span>
    ),
  },
  {
    term: "access-group:<name>",
    description: (
      <span>
        Instances associated with the <code>&lt;name&gt;</code> access group
      </span>
    ),
  },
  {
    term: "search:<name>",
    description: (
      <span>
        Instances meeting the terms of the <code>&lt;name&gt;</code> saved
        search
      </span>
    ),
  },
  {
    term: "upgrade-profile:<name>",
    description: (
      <span>
        Instances associated with the <code>&lt;name&gt;</code> upgrade profile
      </span>
    ),
  },
  {
    term: "removal-profile:<name>",
    description: (
      <span>
        Instances associated with the <code>&lt;name&gt;</code> removal profile
      </span>
    ),
  },
  {
    term: "tag:<keyword>",
    description: (
      <span>
        Instances associated with the <code>&lt;keyword&gt;</code> tag
      </span>
    ),
  },
  {
    term: "hostname:<keyword>",
    description: (
      <span>
        Instance with the hostname <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "title:<keyword>",
    description: (
      <span>
        Instance with the title <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "license-id:<license_id>",
    description: (
      <span>
        Search for instances licensed to the specified{" "}
        <code>&lt;license_id&gt;</code>
      </span>
    ),
  },
  {
    term: "needs:license OR license-id:none",
    description:
      "Search for instances that do not have a Landscape license, and, as a result, are not managed",
  },
  {
    term: "annotation:<key>",
    description: (
      <span>
        Search for instances which define the specified annotation key.
        Optionally specify <code>annotation:&lt;key&gt;:&lt;string&gt;</code>{" "}
        which will only return instances whose key matches and value also
        contains the <code>&lt;string&gt;</code> specified
      </span>
    ),
  },
];

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
