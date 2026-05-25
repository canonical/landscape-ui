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

export const SETTINGS_HELP_TEXT = {
  acquireByHash: `Provides repository index files (like Packages and Sources) via their hash sums instead of just their names. This prevents "Hash Sum Mismatch" errors on client machines if the repository is updated during an active apt-get update session.`,
  butAutomaticUpgrades: `This creates an exception to the "Limit Automatic Installation" rule. While new packages from this repository won't be installed automatically, any package already installed on a system will be upgraded whenever a newer version is published to this repository.`,
  notAutomatic: `This tells apt that packages in this repository should not be installed or upgraded automatically. Users must explicitly target this repository or specific package versions to install them.`,
};
