import type {
  InstancePackage,
  Package,
  DowngradePackageVersion,
} from "@/features/packages";

export const packages: Package[] = [
  {
    id: 15,
    name: "libthai0",
    summary: "Thai language support library",
    computers: [
      {
        id: 1,
        status: "installed",
        current_version: "0.1.9-1",
        available_version: "0.1.9-1-1",
      },
      {
        id: 2,
        status: "installed",
        current_version: "0.1.9-1",
        available_version: "0.1.9-1-1",
      },
      {
        id: 3,
        status: "installed",
        current_version: "0.1.9-1",
        available_version: "0.1.9-1-1",
      },
      {
        id: 4,
        status: "installed",
        current_version: "0.1.9-1",
        available_version: "0.1.9-1-1",
      },
      {
        id: 5,
        status: "installed",
        current_version: "0.1.9-1",
        available_version: "0.1.9-1-1",
      },
      {
        id: 6,
        status: "installed",
        current_version: "0.1.9-1",
        available_version: "0.1.9-1-1",
      },
    ],
  },
  {
    id: 58667,
    name: "binutils-common",
    summary: "Common files for the GNU assembler, linker and binary utilities",
    computers: [
      {
        id: 20,
        status: "security",
        current_version: "2.38-4ubuntu2.3",
        available_version: "2.38-4ubuntu2.4",
      },
      {
        id: 1,
        status: "security",
        current_version: "2.38-4ubuntu2.3",
        available_version: "2.38-4ubuntu2.4",
      },
    ],
  },
  {
    id: 9779,
    name: "libbinutils",
    summary: "GNU binary utilities (private shared library)",
    computers: [
      {
        id: 20,
        status: "security",
        current_version: "2.38-4ubuntu2.3",
        available_version: "2.38-4ubuntu2.4",
      },
      {
        id: 1,
        status: "installed",
        current_version: null,
        available_version: null,
      },
    ],
  },
  {
    id: 174788,
    name: "accountsservice",
    summary: "query and manipulate user account information",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "0.6.55-0ubuntu11",
        available_version: "0.6.55-0ubuntu12~20.04.6",
      },
    ],
  },
  {
    id: 141906,
    name: "alsa-ucm-conf",
    summary: "ALSA Use Case Manager configuration files",
    computers: [
      {
        id: 21,
        status: "installed",
        current_version: "1.2.2-1",
        available_version: "1.2.2-1ubuntu0.13",
      },
      {
        id: 1,
        status: "installed",
        current_version: "1.2.2-1",
        available_version: "1.2.2-1ubuntu0.13",
      },
    ],
  },
  {
    id: 117729,
    name: "base-files",
    summary: "Debian base system miscellaneous files",
    computers: [
      {
        id: 21,
        status: "installed",
        current_version: "11ubuntu5",
        available_version: "11ubuntu5.7",
      },
      {
        id: 1,
        status: "held",
        current_version: "11ubuntu5",
        available_version: "11ubuntu5.7",
      },
    ],
  },
  {
    id: 119557,
    name: "bash",
    summary: "GNU Bourne Again SHell",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "5.0-6ubuntu1",
        available_version: "5.0-6ubuntu1.2",
      },
    ],
  },
  {
    id: 112691,
    name: "bcache-tools",
    summary: "bcache userspace tools",
    computers: [
      {
        id: 21,
        status: "installed",
        current_version: "1.0.8-3",
        available_version: "1.0.8-3ubuntu0.1",
      },
    ],
  },
  {
    id: 114990,
    name: "bind9-dnsutils",
    summary: "Clients provided with BIND 9",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "1:9.16.1-0ubuntu2.1",
        available_version: "1:9.16.1-0ubuntu2.16",
      },
    ],
  },
  {
    id: 107211,
    name: "bind9-libs",
    summary: "Shared Libraries used by BIND 9",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "1:9.16.1-0ubuntu2.1",
        available_version: "1:9.16.1-0ubuntu2.16",
      },
    ],
  },
  {
    id: 160136,
    name: "bsdutils",
    summary: "basic utilities from 4.4BSD-Lite",
    computers: [
      {
        id: 21,
        status: "installed",
        current_version: "1:2.34-0.1ubuntu9",
        available_version: "1:2.34-0.1ubuntu9.4",
      },
    ],
  },
  {
    id: 115909,
    name: "busybox-static",
    summary: "Standalone rescue shell with tons of builtin utilities",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "1:1.30.1-4ubuntu6",
        available_version: "1:1.30.1-4ubuntu6.4",
      },
    ],
  },
  {
    id: 111339,
    name: "ca-certificates",
    summary: "Common CA certificates",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "20190110ubuntu1",
        available_version: "20230311ubuntu0.20.04.1",
      },
    ],
  },
  {
    id: 114533,
    name: "cloud-init",
    summary: "initialization and customization tool for cloud instances",
    computers: [
      {
        id: 21,
        status: "installed",
        current_version: "20.1-10-g71af48df-0ubuntu5",
        available_version: "23.3.3-0ubuntu0~20.04.1",
      },
    ],
  },
  {
    id: 158772,
    name: "cloud-initramfs-dyn-netconf",
    summary: "write a network interface file in /run for BOOTIF",
    computers: [
      {
        id: 21,
        status: "installed",
        current_version: "0.45ubuntu1",
        available_version: "0.45ubuntu2",
      },
    ],
  },
  {
    id: 158773,
    name: "cpio",
    summary: "GNU cpio -- a program to manage archives of files",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "2.13+dfsg-2",
        available_version: "2.13+dfsg-2ubuntu0.3",
      },
    ],
  },
  {
    id: 104505,
    name: "cryptsetup",
    summary: "disk encryption support - startup scripts",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "2:2.2.2-3ubuntu2",
        available_version: "2:2.2.2-3ubuntu2.4",
      },
    ],
  },
  {
    id: 164749,
    name: "cryptsetup-bin",
    summary: "disk encryption support - command line tools",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "2:2.2.2-3ubuntu2",
        available_version: "2:2.2.2-3ubuntu2.4",
      },
    ],
  },
  {
    id: 146052,
    name: "cryptsetup-run",
    summary: "transitional dummy package for cryptsetup",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "2:2.2.2-3ubuntu2",
        available_version: "2:2.2.2-3ubuntu2.4",
      },
    ],
  },
  {
    id: 117735,
    name: "curl",
    summary: "command line tool for transferring data with URL syntax",
    computers: [
      {
        id: 21,
        status: "security",
        current_version: "7.68.0-1ubuntu2",
        available_version: "7.68.0-1ubuntu2.21",
      },
    ],
  },
];

export const getInstancePackages = (instanceId: number): InstancePackage[] => {
  return packages
    .filter(({ computers }) => computers.some(({ id }) => id === instanceId))
    .flatMap(({ computers, ...commonProps }) =>
      computers
        .filter(({ id }) => id === instanceId)
        .map((instanceProps) => ({ ...instanceProps, ...commonProps })),
    );
};

export const downgradePackageVersions: DowngradePackageVersion[] = [
  {
    id: 1,
    name: "libthai0",
    summary: "Thai language support library",
    version: "0.1.8-2",
  },
  {
    id: 2,
    name: "libthai0",
    summary: "Thai language support library",
    version: "0.1.7-3",
  },
];
