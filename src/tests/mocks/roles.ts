import type { Permission } from "@/types/Permission";
import type { Role } from "@/types/Role";

export const permissions = [
  { name: "ViewComputer", title: "View computers", global: false },
  { name: "ManageComputer", title: "Manage computers", global: false },
  {
    name: "AddComputerToAccessGroup",
    title: "Add computers to an access group",
    global: false,
  },
  {
    name: "RemoveComputerFromAccessGroup",
    title: "Remove computers from an access group",
    global: false,
  },
  {
    name: "ManagePendingComputer",
    title: "Manage pending computers",
    global: false,
  },
  { name: "ViewScript", title: "View scripts", global: false },
  { name: "ManageScript", title: "Manage scripts", global: false },
  { name: "RedactScript", title: "Redact scripts", global: false },
  { name: "ManageMAAS", title: "Manage MAAS Servers", global: false },
  {
    name: "ViewRepositoryProfile",
    title: "View repository profiles",
    global: false,
  },
  {
    name: "ManageRepositoryProfile",
    title: "Manage repository profiles",
    global: false,
  },
  { name: "ViewRepository", title: "View package repositories", global: false },
  {
    name: "ManageRepository",
    title: "Manage package repositories",
    global: false,
  },
  { name: "ViewUpgradeProfile", title: "View upgrade profiles", global: false },
  {
    name: "ManageUpgradeProfile",
    title: "Manage upgrade profiles",
    global: false,
  },
  {
    name: "ViewScheduledProfile",
    title: "View scheduled profiles",
    global: false,
  },
  {
    name: "ManageScheduledProfile",
    title: "Manage scheduled profiles",
    global: false,
  },
  { name: "ViewPackageProfile", title: "View package profiles", global: false },
  {
    name: "ManagePackageProfile",
    title: "Manage package profiles",
    global: false,
  },
  {
    name: "ViewAutoinstallFile",
    title: "View Autoinstall Files",
    global: false,
  },
  {
    name: "ManageAutoinstallFile",
    title: "Manage Autoinstall Files",
    global: false,
  },
  { name: "ViewEmployee", title: "View Employees", global: false },
  { name: "ManageEmployee", title: "Manage Employees", global: false },
  { name: "ViewRemovalProfile", title: "View removal profiles", global: false },
  {
    name: "ManageRemovalProfile",
    title: "Manage removal profiles",
    global: false,
  },
  {
    name: "ViewChildInstanceProfile",
    title: "View child instance profiles",
    global: false,
  },
  {
    name: "ManageChildInstanceProfile",
    title: "Manage child instance profiles",
    global: false,
  },
  { name: "ViewScriptProfile", title: "View script profiles", global: false },
  {
    name: "ManageScriptProfile",
    title: "Manage script profiles",
    global: false,
  },
  { name: "ManageAccount", title: "Manage account", global: true },
  { name: "ViewRole", title: "View Roles", global: true },
  { name: "ManageRole", title: "Manage Roles", global: true },
  { name: "ViewEventLog", title: "View event log", global: true },
  { name: "ManageGPGKey", title: "Manage GPG keys", global: true },
  { name: "ViewBilling", title: "View Billing", global: true },
  { name: "ManageBilling", title: "Manage Billing", global: true },
  { name: "ManageSecrets", title: "Manage secrets", global: true },
] as const satisfies Permission[];

const getRolePermissions = (slicedPermissions: Permission[]) =>
  slicedPermissions.map((p) => p.name);

export const roles = [
  {
    name: "GlobalAdmin",
    description: "Global role with full privileges in the account",
    permissions: getRolePermissions(permissions.slice(0, 3)),
    persons: [
      "bob@example.com",
      "john@example.com",
      "noel@example.com",
      "robert@example.com",
    ],
    access_groups: ["global"],
  },
  {
    name: "Auditor",
    description: "Predefined Auditor role",
    permissions: getRolePermissions(permissions.slice(1, 4)),
    global_permissions: [],
    persons: [
      "bob@example.com",
      "john@example.com",
      "noel@example.com",
      "robert@example.com",
    ],
    access_groups: ["global"],
  },
  {
    name: "Billing-Office1",
    description: "",
    permissions: [],
    global_permissions: getRolePermissions(permissions.slice(0, 3)),
    persons: ["bob@example.com", "robert@example.com"],
    access_groups: [],
  },
  {
    name: "DesktopAdmin",
    description: "Desktops administrators",
    permissions: getRolePermissions(permissions.slice(3, 6)),
    global_permissions: [],
    persons: ["bob@example.com", "robert@example.com"],
    access_groups: ["desktop"],
  },
  {
    name: "NewRole",
    description: "Custom role for testing",
    permissions: [],
    global_permissions: getRolePermissions(permissions.slice(0, 3)),
    persons: ["bob@example.com"],
    access_groups: ["sub-test", "test"],
  },
  {
    name: "Officer",
    description: "",
    permissions: [],
    global_permissions: getRolePermissions(permissions.slice(0, 3)),
    persons: ["bob@example.com"],
    access_groups: ["global"],
  },
  {
    name: "ServerAdmin",
    description: "Servers administrators",
    permissions: getRolePermissions(permissions),
    global_permissions: [],
    persons: ["bob@example.com", "robert@example.com"],
    access_groups: [],
  },
  {
    name: "ServerAuditor",
    description: "Servers auditors",
    permissions: getRolePermissions(permissions.slice(0, 5)),
    global_permissions: [],
    persons: ["bob@example.com", "robert@example.com"],
    access_groups: [],
  },
  {
    name: "SupportAnalyst",
    description: "Predefined SupportAnalyst role",
    permissions: getRolePermissions(permissions.slice(1, 6)),
    global_permissions: [],
    persons: ["bob@example.com"],
    access_groups: ["desktop", "windows-xp"],
  },
  {
    name: "TestRole",
    description: "Test role description",
    permissions: getRolePermissions(permissions.slice(0, 3)),
    global_permissions: getRolePermissions(permissions.slice(0, 1)),
    persons: ["bob@example.com", "jane@example.com"],
    access_groups: ["global"],
  },
] as const satisfies Role[];

export const administratorRoles = roles.map((role) => role.name);
