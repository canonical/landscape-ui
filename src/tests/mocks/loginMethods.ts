import { LoginMethods } from "@/features/auth";

export const allLoginMethods: LoginMethods = {
  oidc: {
    available: true,
    configurations: [
      {
        name: "Okta Enabled",
        provider: "okta",
        enabled: true,
        id: 1,
      },
      {
        name: "Okta Disabled",
        provider: "okta",
        enabled: false,
        id: 2,
      },
    ],
  },
  standalone_oidc: {
    available: true,
    enabled: true,
  },
  ubuntu_one: {
    available: true,
    enabled: true,
  },
  password: {
    available: true,
    enabled: true,
  },
  pam: {
    available: false,
    enabled: false,
  },
};

export const noneLoginMethods: LoginMethods = {
  oidc: {
    available: false,
    configurations: [],
  },
  standalone_oidc: {
    available: false,
    enabled: false,
  },
  ubuntu_one: {
    available: false,
    enabled: false,
  },
  password: {
    available: false,
    enabled: false,
  },
  pam: {
    available: false,
    enabled: false,
  },
};
