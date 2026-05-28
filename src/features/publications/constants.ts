import * as Yup from "yup";

export const REQUIRED_FIELD_MESSAGE = "This field is required";

export const VALIDATION_SCHEMA_NEW = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publicationTarget: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  signingKey: Yup.string(),
  hashIndexing: Yup.boolean(),
  automaticUpgrades: Yup.boolean(),
  limitAutomaticInstallation: Yup.boolean(),
  skipBz2: Yup.boolean(),
  skipContentIndexing: Yup.boolean(),
});

export const VALIDATION_SCHEMA_EXISTING = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
});

export const AUTOMATIC_LABELS = {
  both: "Automatic installs and upgrades",
  upgrades: "Automatic upgrades only",
  neither: "Manual installs and upgrades",
};
