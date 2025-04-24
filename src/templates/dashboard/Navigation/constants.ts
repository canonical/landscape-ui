import type { MenuItem } from "./types";

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "Overview",
    path: "/overview",
    icon: "switcher-dashboard",
  },
  {
    label: "Instances",
    path: "/instances",
    icon: "machines",
  },
  {
    label: "Activities",
    path: "/activities",
    icon: "switcher-environments",
  },
  {
    label: "Scripts",
    path: "/scripts",
    icon: "code",
  },
  {
    label: "Events log",
    path: "/events-log",
    icon: "status",
  },
  {
    label: "Profiles",
    path: "/profile",
    icon: "cluster",
    items: [
      {
        label: "Repository profiles",
        path: "/profiles/repositories",
      },
      {
        label: "Package profiles",
        path: "/profiles/package",
      },
      {
        label: "Upgrade profiles",
        path: "/profiles/upgrade",
      },
      {
        label: "Reboot profiles",
        path: `/profiles/reboot`,
      },
      {
        label: "Removal profiles",
        path: "/profiles/removal",
      },
      {
        label: "WSL profiles",
        path: "/profiles/wsl",
        env: "selfHosted",
      },
      {
        label: "Security profiles",
        path: "/profiles/security",
      },
    ],
  },
  {
    label: "Repositories",
    path: "/repositories",
    icon: "fork",
    env: "selfHosted",
    items: [
      {
        label: "Mirrors",
        path: "/repositories/mirrors",
      },
      {
        label: "GPG Keys",
        path: "/repositories/gpg-keys",
      },
      {
        label: "APT Sources",
        path: "/repositories/apt-sources",
      },
    ],
  },
  {
    label: "Org. settings",
    path: "/settings",
    icon: "settings",
    items: [
      {
        label: "General",
        path: "/settings/general",
      },
      {
        label: "Administrators",
        path: "/settings/administrators",
      },
      {
        label: "Employees",
        path: "/settings/employees",
        requiresFeature: "employee-management",
      },
      {
        label: "Roles",
        path: "/settings/roles",
      },
      {
        label: "Access groups",
        path: "/settings/access-groups",
      },
      {
        label: "Identity providers",
        path: "/settings/identity-providers",
        requiresFeature: "oidc-configuration",
      },
      {
        label: "GPG Keys",
        path: "/repositories/gpg-keys",
        env: "saas",
      },
    ],
  },
  {
    label: "Help",
    path: "/help",
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
        path: "https://support-portal.canonical.com/",
      },
    ],
  },
];
