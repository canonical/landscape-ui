import type { Feature } from "@/types/Feature";

export const features: Feature[] = [
  {
    name: "Custom OIDC configuration",
    description:
      "Configure third-party OIDC authentication providers on an individual account.",
    key: "oidc-configuration",
    database_key: 1,
    enabled: true,
    details: {
      configuration: false,
    },
  },
  {
    name: "Single-page application dashboard",
    description: "Access the 'new', REST-API-backed dashboard.",
    key: "spa-dashboard",
    database_key: 2,
    enabled: true,
    details: {
      configuration: false,
    },
  },
  {
    name: "Employee management",
    description: "Provision and manage instances for other users.",
    key: "employee-management",
    database_key: 3,
    enabled: true,
    details: {
      configuration: false,
    },
  },
  {
    name: "USG Profiles",
    description:
      "Allows for profiles that handle security and hardening measures",
    key: "usg-profiles",
    database_key: 5,
    enabled: false,
    details: {
      configuration: true,
      account: false,
    },
  },
];
