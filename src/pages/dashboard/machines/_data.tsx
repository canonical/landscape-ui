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
    computer_id: 13,
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
    computer_id: 13,
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
    computer_id: 13,
  },
  {
    pid: 1003,
    gid: 2,
    uid: 2,
    name: "process4",
    state: 5,
    start_time: "2022-11-15 08:30:00",
    vm_size: 8192,
    cpu_utilization: 0.15,
    computer_id: 13,
  },
  {
    pid: 1004,
    gid: 1,
    uid: 3,
    name: "process5",
    state: 3,
    start_time: "2023-02-20 12:45:00",
    vm_size: 20480,
    cpu_utilization: 0.25,
    computer_id: 13,
  },
  {
    pid: 1005,
    gid: 3,
    uid: 1,
    name: "process6",
    state: 7,
    start_time: "2021-08-10 18:20:00",
    vm_size: 4096,
    cpu_utilization: 0.12,
    computer_id: 13,
  },
  {
    pid: 1006,
    gid: 2,
    uid: 3,
    name: "process7",
    state: 2,
    start_time: "2022-04-25 05:30:00",
    vm_size: 16384,
    cpu_utilization: 0.22,
    computer_id: 13,
  },
  {
    pid: 1007,
    gid: 1,
    uid: 2,
    name: "process8",
    state: 9,
    start_time: "2023-01-08 14:15:00",
    vm_size: 6144,
    cpu_utilization: 0.17,
    computer_id: 13,
  },
  {
    pid: 1008,
    gid: 3,
    uid: 3,
    name: "process9",
    state: 4,
    start_time: "2021-11-30 22:00:00",
    vm_size: 10240,
    cpu_utilization: 0.19,
    computer_id: 13,
  },
  {
    pid: 1009,
    gid: 2,
    uid: 1,
    name: "process10",
    state: 6,
    start_time: "2022-07-12 09:45:00",
    vm_size: 7168,
    cpu_utilization: 0.21,
    computer_id: 13,
  },
  {
    pid: 1010,
    gid: 1,
    uid: 2,
    name: "process11",
    state: 3,
    start_time: "2022-08-18 17:30:00",
    vm_size: 8192,
    cpu_utilization: 0.18,
    computer_id: 13,
  },
  {
    pid: 1011,
    gid: 1,
    uid: 3,
    name: "process12",
    state: 7,
    start_time: "2023-03-05 11:00:00",
    vm_size: 12288,
    cpu_utilization: 0.23,
    computer_id: 13,
  },
  {
    pid: 1012,
    gid: 1,
    uid: 1,
    name: "process13",
    state: 5,
    start_time: "2021-12-22 03:45:00",
    vm_size: 10240,
    cpu_utilization: 0.16,
    computer_id: 13,
  },
  {
    pid: 1013,
    gid: 1,
    uid: 2,
    name: "process14",
    state: 8,
    start_time: "2022-01-30 20:15:00",
    vm_size: 6144,
    cpu_utilization: 0.21,
    computer_id: 13,
  },
  {
    pid: 1014,
    gid: 1,
    uid: 3,
    name: "process15",
    state: 4,
    start_time: "2023-06-10 14:30:00",
    vm_size: 14336,
    cpu_utilization: 0.19,
    computer_id: 13,
  },
  {
    pid: 1015,
    gid: 1,
    uid: 1,
    name: "process16",
    state: 6,
    start_time: "2021-09-08 08:00:00",
    vm_size: 10240,
    cpu_utilization: 0.25,
    computer_id: 13,
  },
  {
    pid: 1016,
    gid: 1,
    uid: 2,
    name: "process17",
    state: 9,
    start_time: "2022-04-02 02:45:00",
    vm_size: 7168,
    cpu_utilization: 0.17,
    computer_id: 13,
  },
  {
    pid: 1017,
    gid: 1,
    uid: 3,
    name: "process18",
    state: 2,
    start_time: "2023-02-15 19:20:00",
    vm_size: 10240,
    cpu_utilization: 0.22,
    computer_id: 13,
  },
  {
    pid: 1018,
    gid: 1,
    uid: 1,
    name: "process19",
    state: 10,
    start_time: "2021-11-18 12:15:00",
    vm_size: 5120,
    cpu_utilization: 0.2,
    computer_id: 13,
  },
  {
    pid: 1019,
    gid: 1,
    uid: 2,
    name: "process20",
    state: 1,
    start_time: "2022-07-25 06:30:00",
    vm_size: 10240,
    cpu_utilization: 0.18,
    computer_id: 13,
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
