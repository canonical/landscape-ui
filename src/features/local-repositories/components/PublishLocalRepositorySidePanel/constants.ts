import * as Yup from "yup";

export interface PublishRepositoryNewFormValues {
  name: string;
  publicationTarget: string;
  gpgKey: string;
  acquireByHash: boolean;
  butAutomaticUpgrades: boolean;
  notAutomatic: boolean;
  skipBz2: boolean;
  skipContents: boolean;
}

const REQUIRED_FIELD_MESSAGE = "This field is required";

export const VALIDATION_SCHEMA_NEW = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publicationTarget: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  gpgKey: Yup.string(),
  acquireByHash: Yup.boolean(),
  butAutomaticUpgrades: Yup.boolean(),
  notAutomatic: Yup.boolean(),
  skipBz2: Yup.boolean(),
  skipContents: Yup.boolean(),
});

export const VALIDATION_SCHEMA_EXISTING = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
});
