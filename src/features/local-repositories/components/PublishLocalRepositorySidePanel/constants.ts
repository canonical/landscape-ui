import * as Yup from "yup";

export interface PublishRepositoryNewFormValues {
  name: string;
  publication_target: string;
  distribution: string;
  signing_key: string;
  hash_indexing: boolean;
  automatic_installation: boolean;
  automatic_upgrades: boolean;
  skip_bz2: boolean;
  skip_content_indexing: boolean;
}

const REQUIRED_FIELD_MESSAGE = "This field is required";

export const VALIDATION_SCHEMA_NEW = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publication_target: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  distribution: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  signing_key: Yup.string(),
  hash_indexing: Yup.boolean(),
  automatic_installation: Yup.boolean(),
  automatic_upgrades: Yup.boolean(),
  skip_bz2: Yup.boolean(),
  skip_content_indexing: Yup.boolean(),
});

export const VALIDATION_SCHEMA_EXISTING = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
});

export const SETTINGS_HELP_TEXT = {
  hashIndexing: `Provides repository index files (like Packages and Sources) via their hash sums instead of just their names. This prevents "Hash Sum Mismatch" errors on client machines if the repository is updated during an active apt-get update session.`,
  automaticInstallation: `This creates an exception to the "Limit Automatic Installation" rule. While new packages from this repository won't be installed automatically, any package already installed on a system will be upgraded whenever a newer version is published to this repository.`,
  automaticUpgrades: `This tells apt that packages in this repository should not be installed or upgraded automatically. Users must explicitly target this repository or specific package versions to install them.`,
};
