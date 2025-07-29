import type { ProviderFormValues } from "./types";

export const INITIAL_VALUES: ProviderFormValues = {
  client_id: "",
  client_secret: "",
  enabled: false,
  issuer: "",
  name: "",
};

export const SCOPES_OPTIONS = [
  {
    label: "openid",
    value: "openid",
  },
  {
    label: "email",
    value: "email",
  },
];

export const SCOPES_DEFAULT_VALUES = SCOPES_OPTIONS.map(
  (option) => option.value,
);
