import type {
  DowngradePackageVersion,
  InstancePackage,
  Package,
  PackageInstance,
} from "@/features/packages";
import type { PackageUpgrade } from "@/features/upgrades";

export const packages = [
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
  {
    id: 99999,
    name: "no-upgrades-pkg",
    summary: "package without available upgrades",
    computers: [
      {
        id: 999,
        status: "installed",
        current_version: "1.0.0",
        available_version: null,
      },
    ],
  },
] as const satisfies Package[];

export const getInstancePackages = (instanceId: number): InstancePackage[] => {
  return packages
    .filter(({ computers }) => computers.some(({ id }) => id === instanceId))
    .flatMap(({ computers, ...commonProps }) =>
      computers
        .filter(({ id }) => id === instanceId)
        .map((instanceProps) => ({ ...instanceProps, ...commonProps })),
    );
};

export const downgradePackageVersions = [
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
] as const satisfies DowngradePackageVersion[];

export const packageInstances: PackageInstance[] = [
  {
    name: "instance 1",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 2",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 3",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 4",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 5",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 6",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 7",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 8",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 9",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 10",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 11",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
  {
    name: "instance 12",
    installed_version: "0.1.9-1",
    latest_available_version: "1.0.1",
  },
];

export const upgradePackages: PackageUpgrade[] = [
  {
    name: "libthai0",
    details: "Thai language support library",
    affected_instance_count: 6,
    os: "Ubuntu 22.04",
    versions: {
      current: "0.1.9-1",
      newest: "0.1.9-1-1",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "binutils-common",
    details: "Common files for the GNU assembler, linker and binary utilities",
    affected_instance_count: 2,
    os: "Ubuntu 22.04",
    versions: {
      current: "2.38-4ubuntu2.3",
      newest: "2.38-4ubuntu2.4",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "libbinutils",
    details: "GNU binary utilities (private shared library)",
    affected_instance_count: 1,
    os: "Ubuntu 22.04",
    versions: {
      current: "2.38-4ubuntu2.3",
      newest: "2.38-4ubuntu2.4",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "accountsservice",
    details: "query and manipulate user account information",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "0.6.55-0ubuntu11",
      newest: "0.6.55-0ubuntu12~20.04.6",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "alsa-ucm-conf",
    details: "ALSA Use Case Manager configuration files",
    affected_instance_count: 2,
    os: "Ubuntu 20.04",
    versions: {
      current: "1.2.2-1",
      newest: "1.2.2-1ubuntu0.13",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "base-files",
    details: "Debian base system miscellaneous files",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "11ubuntu5",
      newest: "11ubuntu5.7",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "bash",
    details: "GNU Bourne Again SHell",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "5.0-6ubuntu1",
      newest: "5.0-6ubuntu1.2",
    },

    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "bcache-tools",
    details: "bcache userspace tools",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "1.0.8-3",
      newest: "1.0.8-3ubuntu0.1",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "bind9-dnsutils",
    details: "Clients provided with BIND 9",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "1:9.16.1-0ubuntu2.1",
      newest: "1:9.16.1-0ubuntu2.16",
    },

    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "bind9-libs",
    details: "Shared Libraries used by BIND 9",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "1:9.16.1-0ubuntu2.1",
      newest: "1:9.16.1-0ubuntu2.16",
    },

    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "bsdutils",
    details: "basic utilities from 4.4BSD-Lite",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "1:2.34-0.1ubuntu9",
      newest: "1:2.34-0.1ubuntu9.4",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "busybox-static",
    details: "Standalone rescue shell with tons of builtin utilities",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "1:1.30.1-4ubuntu6",
      newest: "1:1.30.1-4ubuntu6.4",
    },

    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "ca-certificates",
    details: "Common CA certificates",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "20190110ubuntu1",
      newest: "20230311ubuntu0.20.04.1",
    },

    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "cloud-init",
    details: "initialization and customization tool for cloud instances",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "20.1-10-g71af48df-0ubuntu5",
      newest: "23.3.3-0ubuntu0~20.04.1",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "cloud-initramfs-dyn-netconf",
    details: "write a network interface file in /run for BOOTIF",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "0.45ubuntu1",
      newest: "0.45ubuntu2",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "cpio",
    details: "GNU cpio -- a program to manage archives of files",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "2.13+dfsg-2",
      newest: "2.13+dfsg-2ubuntu0.3",
    },

    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "cryptsetup",
    details: "disk encryption support - startup scripts",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "2:2.2.2-3ubuntu2",
      newest: "2:2.2.2-3ubuntu2.4",
    },

    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "cryptsetup-bin",
    details: "disk encryption support - command line tools",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "2:2.2.2-3ubuntu2",
      newest: "2:2.2.2-3ubuntu2.4",
    },

    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "cryptsetup-run",
    details: "transitional dummy package for cryptsetup",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "2:2.2.2-3ubuntu2",
      newest: "2:2.2.2-3ubuntu2.4",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "curl",
    details: "command line tool for transferring data with URL syntax",
    affected_instance_count: 1,
    os: "Ubuntu 20.04",
    versions: {
      current: "7.68.0-1ubuntu2",
      newest: "7.68.0-1ubuntu2.21",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "architectures",
    details:
      "Qui quia veritatis amet repellat cupiditate quo deserunt reiciendis totam.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "2.3.0",
      newest: "2.4.6",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "architectures",
    details:
      "Qui quia veritatis amet repellat cupiditate quo deserunt reiciendis totam.",
    affected_instance_count: 10123,
    os: "Ubuntu 20.04",
    versions: {
      current: "1.3.0",
      newest: "1.4.6",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "assistant",
    details: "Eaque velit consequatur eaque rem qui voluptatem.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "1.2.1",
      newest: "1.2.2-1ubuntu0.11",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "cotton",
    details:
      "Voluptatem autem eius modi explicabo saepe possimus rerum culpa et.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "1.2.1",
      newest: "1.2.2-1ubuntu0.11",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "cross-platform",
    details: "Explicabo ducimus reprehenderit velit est ut quibusdam.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "1.2.1",
      newest: "1.2.2-1ubuntu0.11",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
  {
    name: "ergonomic",
    details: "Molestiae nemo tenetur debitis maiores tempore possimus.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "1.2.1",
      newest: "1.2.2-1ubuntu0.11",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "high",
    priority: "critical",
  },
  {
    name: "malawi",
    details: "Id facere qui.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "1.2.1",
      newest: "1.2.2-1ubuntu0.11",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "critical",
    priority: "critical",
  },
  {
    name: "new",
    details: "Temporibus adipisci exercitationem est et sunt ea id impedit.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "1.2.1",
      newest: "1.2.2-1ubuntu0.11",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "high",
    priority: "critical",
  },
  {
    name: "pants",
    details: "Illo sapiente incidunt non voluptatem.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "1.2.1",
      newest: "1.2.2-1ubuntu0.11",
    },
    usn: "3809-2",
    cve: "2021-3733",
    severity: "medium",
    priority: "negligible",
  },
  {
    name: "paradigm",
    details: "Soluta reprehenderit hic et.",
    affected_instance_count: 80987,
    os: "Ubuntu 22.04",
    versions: {
      current: "1.2.1",
      newest: "1.2.2-1ubuntu0.11",
    },
    usn: null,
    cve: null,
    severity: null,
    priority: null,
  },
];
