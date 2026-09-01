import type {
  PackageChangePlanSummaryItem,
  Package,
} from "@/features/packages";
import { TargetState } from "@/features/packages";

export const packages = [
  {
    id: 1,
    name: "libthai0",
    summary: "Thai language support library",
    version: "0.1.9-1",
    computers: {
      count: 6,
    },
  },
  {
    id: 2,
    name: "binutils-common",
    summary: "Common files for the GNU assembler, linker and binary utilities",
    version: "2.38-4ubuntu2.3",
    computers: {
      count: 2,
    },
  },
  {
    id: 3,
    name: "libbinutils",
    summary: "GNU binary utilities (private shared library)",
    version: "2.38-4ubuntu2.3",
    computers: {
      count: 2,
    },
  },
  {
    id: 4,
    name: "package-with-very-long-name-that-should-be-truncated-in-the-ui",
    summary:
      "This package has a very long name and should be truncated in the UI",
    version:
      "1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20.21.22.23.24.25.26.27.28.29",
    computers: {
      count: 1,
    },
  },
  {
    id: 5,
    name: "accountsservice",
    summary: "query and manipulate user account information",
    version: "0.6.55-0ubuntu11",
    computers: {
      count: 1,
    },
  },
  {
    id: 6,
    name: "alsa-ucm-conf",
    summary: "ALSA Use Case Manager configuration files",
    version: "1.2.2-1",
    computers: {
      count: 2,
    },
  },
  {
    id: 7,
    name: "apt",
    summary: "APT package management utility",
    version: "2.3.1",
    computers: {
      count: 23,
    },
  },
  {
    id: 8,
    name: "apt",
    summary: "APT package management utility",
    version: "1.4.8",
    computers: {
      count: 7,
    },
  },
  {
    id: 9,
    name: "apt-venv",
    summary: "APT virtual environment",
    version: "2.1.0",
    computers: {
      count: 42,
    },
  },
  {
    id: 10,
    name: "apt-venv",
    summary: "APT virtual environment",
    version: "2.2.3",
    computers: {
      count: 15,
    },
  },
  {
    id: 11,
    name: "apt-doc",
    summary: "APT documentation",
    version: "2.0.9",
    computers: {
      count: 38,
    },
  },
  {
    id: 12,
    name: "apt-src",
    summary: "APT source package management tool",
    version: "2.3.0",
    computers: {
      count: 29,
    },
  },
  {
    id: 13,
    name: "apt-src",
    summary: "APT source package management tool",
    version: "2.3.2",
    computers: {
      count: 4,
    },
  },
  {
    id: 14,
    name: "base-files",
    summary: "Debian base system miscellaneous files",
    version: "11ubuntu5",
    computers: {
      count: 2,
    },
  },
  {
    id: 15,
    name: "bash",
    summary: "GNU Bourne Again SHell",
    version: "5.0-6ubuntu1",
    computers: {
      count: 2,
    },
  },
  {
    id: 16,
    name: "bcache-tools",
    summary: "bcache userspace tools",
    version: "1.0.8-3",
    computers: {
      count: 1,
    },
  },
  {
    id: 17,
    name: "bind9-dnsutils",
    summary: "Clients provided with BIND 9",
    version: "1:9.16.1-0ubuntu2.1",
    computers: {
      count: 1,
    },
  },
  {
    id: 1,
    name: "bind9-libs",
    summary: "Shared Libraries used by BIND 9",
    version: "1:9.16.1-0ubuntu2.1",
    computers: {
      count: 1,
    },
  },
  {
    id: 19,
    name: "bsdutils",
    summary: "basic utilities from 4.4BSD-Lite",
    version: "1:2.34-0.1ubuntu9",
    computers: {
      count: 1,
    },
  },
  {
    id: 20,
    name: "busybox-static",
    summary: "Standalone rescue shell with tons of builtin utilities",
    version: "1:1.30.1-4ubuntu6",
    computers: {
      count: 1,
    },
  },
  {
    id: 21,
    name: "ca-certificates",
    summary: "Common CA certificates",
    version: "20190110ubuntu1",
    computers: {
      count: 1,
    },
  },
  {
    id: 22,
    name: "cloud-init",
    summary: "initialization and customization tool for cloud instances",
    version: "20.1-10-g71af48df-0ubuntu5",
    computers: {
      count: 1,
    },
  },
  {
    id: 23,
    name: "cloud-initramfs-dyn-netconf",
    summary: "write a network interface file in /run for BOOTIF",
    version: "0.45ubuntu1",
    computers: {
      count: 1,
    },
  },
  {
    id: 24,
    name: "cpio",
    summary: "GNU cpio -- a program to manage archives of files",
    version: "2.13+dfsg-2",
    computers: {
      count: 1,
    },
  },
  {
    id: 25,
    name: "cron-apt",
    summary: "periodically run apt-get update and upgrade",
    version: "2.1.4",
    computers: {
      count: 11,
    },
  },
  {
    id: 26,
    name: "cryptsetup",
    summary: "disk encryption support - startup scripts",
    version: "2:2.2.2-3ubuntu2",
    computers: {
      count: 1,
    },
  },
  {
    id: 27,
    name: "cryptsetup-bin",
    summary: "disk encryption support - command line tools",
    version: "2:2.2.2-3ubuntu2",
    computers: {
      count: 1,
    },
  },
  {
    id: 28,
    name: "cryptsetup-run",
    summary: "transitional dummy package for cryptsetup",
    version: "2:2.2.2-3ubuntu2",
    computers: {
      count: 1,
    },
  },
  {
    id: 29,
    name: "curl",
    summary: "command line tool for transferring data with URL syntax",
    version: "7.68.0-1ubuntu2",
    computers: {
      count: 1,
    },
  },
  {
    id: 30,
    name: "no-upgrades-pkg",
    summary: "package without available upgrades",
    version: "1.0.0",
    computers: {
      count: 1,
    },
  },
] as const satisfies Package[];

export const packageChangePlanSummaryItems = [
  {
    package_id: packages[0].id,
    package_name: packages[0].name,
    package_version: packages[0].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 5 },
      { state: TargetState.NOT_APPLICABLE, count: 1 },
    ],
  },
  {
    package_id: packages[1].id,
    package_name: packages[1].name,
    package_version: packages[1].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 8 },
      { state: TargetState.NOT_APPLICABLE, count: 13 },
    ],
  },
  {
    package_id: packages[2].id,
    package_name: packages[2].name,
    package_version: packages[2].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 57 },
      { state: TargetState.NOT_APPLICABLE, count: 11 },
    ],
  },
  {
    package_id: packages[3].id,
    package_name: packages[3].name,
    package_version: packages[3].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 328 },
      { state: TargetState.NOT_APPLICABLE, count: 119 },
    ],
  },
  {
    package_id: packages[4].id,
    package_name: packages[4].name,
    package_version: packages[4].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 565 },
      { state: TargetState.NOT_APPLICABLE, count: 90 },
    ],
  },
  {
    package_id: packages[5].id,
    package_name: packages[5].name,
    package_version: packages[5].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 71 },
      { state: TargetState.NOT_APPLICABLE, count: 12 },
    ],
  },
  {
    package_id: packages[6].id,
    package_name: packages[6].name,
    package_version: packages[6].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 34 },
      { state: TargetState.NOT_APPLICABLE, count: 6 },
    ],
  },
  {
    package_id: packages[7].id,
    package_name: packages[7].name,
    package_version: packages[7].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 100 },
      { state: TargetState.NOT_APPLICABLE, count: 10 },
    ],
  },
  {
    package_id: packages[8].id,
    package_name: packages[8].name,
    package_version: packages[8].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 2 },
      { state: TargetState.NOT_APPLICABLE, count: 0 },
    ],
  },
  {
    package_id: packages[9].id,
    package_name: packages[9].name,
    package_version: packages[9].version,
    package_state_counts: [
      { state: TargetState.APPLICABLE, count: 0 },
      { state: TargetState.NOT_APPLICABLE, count: 17 },
    ],
  },
] as const satisfies PackageChangePlanSummaryItem[];
