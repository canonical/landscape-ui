import { OldPackage } from "@/features/packages";

export const packages: OldPackage[] = [
  {
    name: "accountsservice",
    version: "0.6.55-0ubuntu12~20.04.6",
    summary: "query and manipulate user account information",
    usn: {
      name: "6190-1",
      summary: "accountsservice vulnerability",
    },
    computers: [
      {
        available_version: "0.6.55-5",
        current_version: "0.6.55-0ubuntu12~20.04.5",
        id: 1,
        status: "installed",
      },
      {
        available_version: "0.6.55-5",
        current_version: "0.6.55-0ubuntu12~20.04.5",
        id: 2,
        status: "security",
      },
    ],
  },
  {
    name: "acl",
    version: "2.2.53-10ubuntu1",
    summary: "Access control list utilities",
    usn: {
      name: "6190-1",
      summary: "acl vulnerability",
    },
    computers: [
      {
        available_version: "2.2.53-10ubuntu1",
        current_version: "2.2.53-10ubuntu1",
        id: 1,
        status: "installed",
      },
      {
        available_version: "2.2.53-10ubuntu1",
        current_version: "2.2.53-10ubuntu1",
        id: 2,
        status: "installed",
      },
    ],
  },
  {
    name: "acpid",
    version: "1:2.0.32-1ubuntu1",
    summary: "Advanced Configuration and Power Interface event daemon",
    usn: {
      name: "6190-1",
      summary: "acpid vulnerability",
    },
    computers: [
      {
        available_version: "1: 2.0.32-1ubuntu1",
        current_version: "1:2.0.32-1ubuntu1",
        id: 1,
        status: "installed",
      },
    ],
  },
  {
    name: "adduser",
    version: "3.118ubuntu2",
    summary: "add and remove users and groups",
    usn: {
      name: "6190-1",
      summary: "adduser vulnerability",
    },
    computers: [
      {
        available_version: "3.118ubuntu2",
        current_version: "3.118ubuntu2",
        id: 1,
        status: "installed",
      },
    ],
  },
  {
    name: "apparmor",
    version: "2.13.3-7.1ubuntu1.3",
    summary: "user-space parser utility for AppArmor",
    usn: {
      name: "6190-1",
      summary: "apparmor vulnerability",
    },
    computers: [
      {
        available_version: "2.13.3-7.1ubuntu1.3",
        current_version: "2.13.3-7.1ubuntu1.3",
        id: 1,
        status: "installed",
      },
    ],
  },
  {
    name: "apport",
    version: "2.20.11-0ubuntu27.16",
    summary: "automatically generate crash reports for debugging",
    usn: {
      name: "6190-1",
      summary: "apport vulnerability",
    },
    computers: [
      {
        available_version: "2.20.11-0ubuntu27.16",
        current_version: "2.20.11-0ubuntu27.16",
        id: 1,
        status: "installed",
      },
    ],
  },
  {
    name: "apt",
    version: "2.0.6",
    summary: "commandline package manager",
    usn: {
      name: "6190-1",
      summary: "apt vulnerability",
    },
    computers: [
      {
        available_version: "2.0.6",
        current_version: "2.0.6",
        id: 1,
        status: "installed",
      },
    ],
  },
];
