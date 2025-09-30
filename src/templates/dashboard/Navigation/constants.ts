import { ROUTES } from "@/libs/routes";
import type { MenuItem } from "./types";

const PROFILES_SUBMENU: MenuItem[] = [
  { label: "Repository profiles", path: ROUTES.profiles.repository() },
  { label: "Package profiles", path: ROUTES.profiles.package() },
  { label: "Upgrade profiles", path: ROUTES.profiles.upgrade() },
  { label: "Reboot profiles", path: ROUTES.profiles.reboot() },
  { label: "Removal profiles", path: ROUTES.profiles.removal() },
  {
    label: "WSL profiles",
    path: ROUTES.profiles.wsl(),
    requiresFeature: "wsl-child-instance-profiles",
  },
  {
    label: "Security profiles",
    path: ROUTES.profiles.security(),
    requiresFeature: "usg-profiles",
  },
];

const REPOSITORY_SUBMENU: MenuItem[] = [
  { label: "Mirrors", path: ROUTES.repositories.mirrors(), env: "selfHosted" },
  { label: "GPG Keys", path: ROUTES.repositories.gpgKeys() },
  { label: "APT Sources", path: ROUTES.repositories.aptSources() },
];

const SETTINGS_SUBMENU: MenuItem[] = [
  { label: "General", path: ROUTES.settings.general() },
  { label: "Administrators", path: ROUTES.settings.administrators() },
  {
    label: "Employees",
    path: ROUTES.settings.employees(),
    requiresFeature: "employee-management",
  },
  { label: "Roles", path: ROUTES.settings.roles() },
  { label: "Access groups", path: ROUTES.settings.accessGroups() },
  {
    label: "Identity providers",
    path: ROUTES.settings.identityProviders(),
    requiresFeature: "oidc-configuration",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "Overview",
    path: ROUTES.overview.root(),
    icon: "switcher-dashboard",
  },
  { label: "Instances", path: ROUTES.instances.root(), icon: "machines" },
  {
    label: "Activities",
    path: ROUTES.activities.root(),
    icon: "switcher-environments",
  },
  { label: "Scripts", path: ROUTES.scripts.root(), icon: "code" },
  { label: "Events log", path: ROUTES.eventsLog.root(), icon: "status" },
  {
    label: "Profiles",
    path: ROUTES.profiles.root(),
    icon: "cluster",
    items: PROFILES_SUBMENU,
  },
  {
    label: "Repositories",
    path: ROUTES.repositories.root(),
    icon: "fork",
    items: REPOSITORY_SUBMENU,
  },
  {
    label: "Org. settings",
    path: ROUTES.settings.root(),
    icon: "settings",
    items: SETTINGS_SUBMENU,
  },
  {
    label: "Documentation",
    path: ROUTES.external.documentation(),
    hasDivider: true,
  },
  {
    label: "Support",
    path: ROUTES.external.support(),
  },
];
