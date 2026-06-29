import * as Yup from "yup";

export const REQUIRED_FIELD_MESSAGE = "This field is required";

export const AUTOMATIC_LABELS = {
  automatic: "Automatic installs and upgrades",
  autoUpgrades: "Automatic upgrades only",
  manual: "Manual installs and upgrades",
} as const;

export const VALIDATION_SCHEMA_NEW = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publicationTarget: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  signingKey: Yup.string(),
  hashIndexing: Yup.boolean(),
  installsAndUpgrades: Yup.string().oneOf(Object.keys(AUTOMATIC_LABELS)),
  skipBz2: Yup.boolean(),
  skipContentIndexing: Yup.boolean(),
});

export const VALIDATION_SCHEMA_NEW_MIRROR = VALIDATION_SCHEMA_NEW.shape({
  distribution: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  architectures: Yup.array().of(Yup.string()).min(1, REQUIRED_FIELD_MESSAGE),
});

export const VALIDATION_SCHEMA_EXISTING = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
});
