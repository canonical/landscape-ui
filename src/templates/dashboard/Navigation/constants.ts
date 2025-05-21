import { ROUTES } from "@/libs/routes";
import type { MenuItem } from "./types";

const PROFILE_SUBMENU: MenuItem[] = [
  { label: "Repository profiles", path: ROUTES.profilesRepository() },
  { label: "Package profiles", path: ROUTES.profilesPackage() },
  { label: "Upgrade profiles", path: ROUTES.profilesUpgrade() },
  { label: "Removal profiles", path: ROUTES.profilesRemoval() },
  { label: "WSL profiles", path: ROUTES.profilesWsl(), env: "selfHosted" },
  { label: "Security profiles", path: ROUTES.profilesSecurity() },
];

const REPOSITORY_SUBMENU: MenuItem[] = [
  { label: "Mirrors", path: ROUTES.repositoriesMirrors() },
  { label: "GPG Keys", path: ROUTES.repositoriesGpgKeys() },
  { label: "APT Sources", path: ROUTES.repositoriesAptSources() },
];

const SETTINGS_SUBMENU: MenuItem[] = [
  { label: "General", path: ROUTES.settingsGeneral() },
  { label: "Administrators", path: ROUTES.settingsAdministrators() },
  { label: "Roles", path: ROUTES.settingsRoles() },
  { label: "Access groups", path: ROUTES.settingsAccessGroups() },
  { label: "Identity providers", path: ROUTES.settingsIdentityProviders() },
];

const HELP_SUBMENU: MenuItem[] = [
  { label: "Legal", path: ROUTES.legal() },
  { label: "Documentation", path: ROUTES.documentation() },
  { label: "Support", path: ROUTES.support() },
];

export const MENU_ITEMS: MenuItem[] = [
  { label: "Overview", path: ROUTES.overview(), icon: "switcher-dashboard" },
  { label: "Instances", path: ROUTES.instances(), icon: "machines" },
  {
    label: "Activities",
    path: ROUTES.activities(),
    icon: "switcher-environments",
  },
  { label: "Scripts", path: ROUTES.scripts(), icon: "code" },
  { label: "Events log", path: ROUTES.eventsLog(), icon: "status" },
  {
    label: "Profiles",
    path: ROUTES.profiles(),
    icon: "cluster",
    items: PROFILE_SUBMENU,
  },
  {
    label: "Repositories",
    path: ROUTES.repositories(),
    icon: "fork",
    env: "selfHosted",
    items: REPOSITORY_SUBMENU,
  },
  {
    label: "Org. settings",
    path: ROUTES.settings(),
    icon: "settings",
    items: SETTINGS_SUBMENU,
  },
  { label: "Help", path: ROUTES.help(), icon: "help", items: HELP_SUBMENU },
];
