import * as Yup from "yup";

export interface PublishRepositoryNewFormValues {
  name: string;
  publicationTarget: string;
  signingKey: string;
  hashIndexing: boolean;
  automaticUpgrades: boolean;
  limitAutomaticInstallation: boolean;
  skipBz2: boolean;
  skipContentIndexing: boolean;
}

const REQUIRED_FIELD_MESSAGE = "This field is required";

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
