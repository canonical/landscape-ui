import * as Yup from "yup";

export const REQUIRED_FIELD_MESSAGE = "This field is required";

export const AUTOMATIC_LABELS = {
  automatic: "Automatic installs and upgrades",
  autoUpgrades: "Automatic upgrades only",
  manual: "Manual installs and upgrades",
} as const;

export type AUTOMATIC_KEY = keyof typeof AUTOMATIC_LABELS;

export const VALIDATION_SCHEMA_NEW = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publicationTarget: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  signingKey: Yup.string(),
  hashIndexing: Yup.boolean(),
  installsAndUpgrades: Yup.string().oneOf(Object.keys(AUTOMATIC_LABELS)),
  skipBz2: Yup.boolean(),
  skipContentIndexing: Yup.boolean(),
});

export const VALIDATION_SCHEMA_EXISTING = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
});
