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
  {
    name: "Support provider login",
    description:
      "Allows support providers to authenticate against subdomain accounts using Ubuntu One SSO. Does not affect RBAC or authorization.",
    key: "support-provider-login",
    database_key: 6,
    enabled: true,
    details: {
      configuration: true,
    },
  },
  {
    name: "WSL Child Instance Profiles",
    description:
      "Allows for profiles that specify configurations of Ubuntu WSL instances on registered Windows hosts.",
    key: "wsl-child-instance-profiles",
    database_key: 7,
    enabled: true,
    details: {
      configuration: true,
    },
  },
];
