import { ReactElement } from "react";
import { ColumnFilterOption } from "@/components/form/ColumnFilter";

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

export const COLUMN_OPTIONS: ColumnFilterOption[] = [
  { canBeHidden: false, label: "Instance name", value: "title" },
  { canBeHidden: true, label: "Status", value: "status" },
  { canBeHidden: true, label: "Upgrades", value: "upgrades" },
  { canBeHidden: true, label: "OS", value: "os" },
  { canBeHidden: true, label: "Availability zone", value: "availability_zone" },
  { canBeHidden: true, label: "Ubuntu pro", value: "ubuntu_pro" },
  { canBeHidden: true, label: "Last ping", value: "last_ping" },
];
