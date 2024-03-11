import { ROOT_PATH } from "@/constants";
import { MenuItem } from "./types";

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "Overview",
    path: `${ROOT_PATH}overview`,
    icon: "switcher-dashboard",
  },
  {
    label: "Instances",
    path: `${ROOT_PATH}instances`,
    icon: "machines",
  },
  {
    label: "Activities",
    path: `${ROOT_PATH}activities`,
    icon: "switcher-environments",
  },
  {
    label: "Scripts",
    path: `${ROOT_PATH}scripts`,
    icon: "code",
  },
  {
    label: "Profiles",
    path: `${ROOT_PATH}profile`,
    icon: "cluster",
    items: [
      {
        label: "Package profiles",
        path: `${ROOT_PATH}profiles/package`,
      },
      {
        label: "Upgrade profiles",
        path: `${ROOT_PATH}profiles/upgrade`,
      },
      {
        label: "Removal profiles",
        path: `${ROOT_PATH}profiles/removal`,
      },
    ],
  },
  {
    label: "Repositories",
    path: `${ROOT_PATH}repositories`,
    icon: "fork",
    items: [
      {
        label: "Mirrors",
        path: `${ROOT_PATH}repositories/mirrors`,
      },
      {
        label: "Repository profiles",
        path: `${ROOT_PATH}repositories/profiles`,
      },
      {
        label: "GPG Keys",
        path: `${ROOT_PATH}repositories/gpg-keys`,
      },
      {
        label: "APT Sources",
        path: `${ROOT_PATH}repositories/apt-sources`,
      },
    ],
  },
  {
    label: "Monitoring",
    path: `${ROOT_PATH}monitoring`,
    icon: "status",
    items: [
      {
        label: "Event logs",
        path: `${ROOT_PATH}monitoring/event-logs`,
      },
      {
        label: "Alerts",
        path: `${ROOT_PATH}monitoring/alerts`,
      },
    ],
  },
  {
    label: "Org. settings",
    path: `${ROOT_PATH}settings`,
    icon: "settings",
    items: [
      {
        label: "Administrators",
        path: `${ROOT_PATH}settings/administrators`,
      },
      {
        label: "Access groups",
        path: `${ROOT_PATH}settings/access-groups`,
      },
      {
        label: "Roles",
        path: `${ROOT_PATH}settings/roles`,
      },
    ],
  },
  {
    label: "Help",
    path: `${ROOT_PATH}Help`,
    icon: "help",
    items: [
      {
        label: "Legal",
        path: "https://ubuntu.com/legal",
      },
      {
        label: "Documentation",
        path: "https://ubuntu.com/landscape/docs",
      },
      {
        label: "Support",
        path: "https://portal.support.canonical.com/staff/s/",
      },
    ],
  },
];
