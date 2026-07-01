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
