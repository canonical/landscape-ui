import type { SelectOption } from "@/types/SelectOption";
import type { FormProps } from "./types";
import * as Yup from "yup";
import { REQUIRED_FIELD_MESSAGE } from "../../constants";

export const SOURCE_TYPE_MIRROR = "Mirror";
export const SOURCE_TYPE_LOCAL_REPOSITORY = "Local repository";

export const SOURCE_TYPE_OPTIONS: SelectOption[] = [
  { label: "Select source type", value: "" },
  { label: SOURCE_TYPE_MIRROR, value: SOURCE_TYPE_MIRROR },
  {
    label: SOURCE_TYPE_LOCAL_REPOSITORY,
    value: SOURCE_TYPE_LOCAL_REPOSITORY,
  },
];

export const SETTINGS_HELP_TEXT = {
  hashIndexing:
    'Provides repository index files (like Packages and Sources) via their hash sums instead of just their names. This prevents "Hash Sum Mismatch" errors on client machines if the repository is updated during an active apt-get update session.',
  automaticInstallation:
    "This tells apt that packages in this repository should not be installed or upgraded automatically. Users must explicitly target this repository or specific package versions to install them.",
  automaticUpgrades:
    'This creates an exception to the "Limit Automatic Installation" rule. While new packages from this repository won\'t be installed automatically, any package already installed on a system will be upgraded whenever a newer version is published to this repository.',
};

export const INITIAL_VALUES: FormProps = {
  name: "",
  sourceType: "",
  source: "",
  publicationTarget: "",
  distribution: "",
  architectures: [],
  signingKey: "",
  hashIndexing: false,
  limitAutomaticInstallation: false,
  automaticUpgrades: false,
  skipBz2: false,
  skipContentIndexing: false,
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  sourceType: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  source: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publicationTarget: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  distribution: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  architectures: Yup.array()
    .of(Yup.string())
    .when("sourceType", {
      is: SOURCE_TYPE_LOCAL_REPOSITORY,
      then: (schema) => schema,
      otherwise: (schema) => schema.min(1, REQUIRED_FIELD_MESSAGE),
    }),
  signingKey: Yup.string(),
  hashIndexing: Yup.boolean(),
  limitAutomaticInstallation: Yup.boolean(),
  automaticUpgrades: Yup.boolean(),
  skipBz2: Yup.boolean(),
  skipContentIndexing: Yup.boolean(),
});
