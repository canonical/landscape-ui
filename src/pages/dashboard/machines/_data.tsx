import { Process } from "../../../types/Process";
import { ReactElement } from "react";

// Mock data to populate the table
export const mockProcesses: Process[] = [
  {
    pid: 1000,
    gid: 1,
    uid: 1,
    name: "process1",
    state: 1,
    start_time: "2021-01-01 00:00:00",
    vm_size: 10240,
    cpu_utilization: 0.1,
    computer_id: 1,
  },
  {
    pid: 1001,
    gid: 1,
    uid: 1,
    name: "process2",
    state: 10,
    start_time: "2022-05-07 00:00:00",
    vm_size: 10240,
    cpu_utilization: 0.2,
    computer_id: 1,
  },
  {
    pid: 1002,
    gid: 2,
    uid: 2,
    name: "process3",
    state: 8,
    start_time: "2023-10-03 00:00:00",
    vm_size: 5120,
    cpu_utilization: 0.18,
    computer_id: 1,
  },
];

export const MACHINE_SEARCH_HELP_TERMS: {
  term: string;
  description: string | ReactElement;
}[] = [
  {
    term: "<keyword>",
    description: (
      <span>
        Computers with the title or hostname <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "distribution:<keyword>",
    description: (
      <span>
        Computers with the installed distribution named{" "}
        <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "needs:reboot",
    description: "Computers needing a reboot",
  },
  {
    term: "alert:<type>",
    description: (
      <>
        <span>
          Computers with outstanding alerts of the specified{" "}
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
          Computers with IP addresses like <code>&lt;address&gt;</code>
        </span>
        <br />
        <span>
          <code>&lt;address&gt;</code> can be a fragment or partial IP address
          representing a subnet such as 91.185.94 to match any computers in the
          subnet.
        </span>
      </>
    ),
  },
  {
    term: "mac:<address>",
    description: (
      <span>
        Computers with the MAC address <code>&lt;address&gt;</code>
      </span>
    ),
  },
  {
    term: "id:<computer_id>",
    description: (
      <span>
        Computer with the id <code>&lt;computer_id&gt;</code>
      </span>
    ),
  },
  {
    term: "access-group:<name>",
    description: (
      <span>
        Computers associated with the <code>&lt;name&gt;</code> access group
      </span>
    ),
  },
  {
    term: "search:<name>",
    description: (
      <span>
        Computers meeting the terms of the <code>&lt;name&gt;</code> saved
        search
      </span>
    ),
  },
  {
    term: "upgrade-profile:<name>",
    description: (
      <span>
        Computers associated with the <code>&lt;name&gt;</code> upgrade profile
      </span>
    ),
  },
  {
    term: "removal-profile:<name>",
    description: (
      <span>
        Computers associated with the <code>&lt;name&gt;</code> removal profile
      </span>
    ),
  },
  {
    term: "tag:<keyword>",
    description: (
      <span>
        Computers associated with the <code>&lt;keyword&gt;</code> tag
      </span>
    ),
  },
  {
    term: "hostname:<keyword>",
    description: (
      <span>
        Computer with the hostname <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "title:<keyword>",
    description: (
      <span>
        Computer with the title <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "license-id:<license_id>",
    description: (
      <span>
        Search for computers licensed to the specified{" "}
        <code>&lt;license_id&gt;</code>
      </span>
    ),
  },
  {
    term: "needs:license OR license-id:none",
    description:
      "Search for computers that do not have a Landscape license, and, as a result, are not managed",
  },
  {
    term: "annotation:<key>",
    description: (
      <span>
        Search for computers which define the specified annotation key.
        Optionally specify <code>annotation:&lt;key&gt;:&lt;string&gt;</code>{" "}
        which will only return computers whose key matches and value also
        contains the <code>&lt;string&gt;</code> specified
      </span>
    ),
  },
];
