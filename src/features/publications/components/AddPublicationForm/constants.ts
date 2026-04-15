import type { SelectOption } from "@/types/SelectOption";
import type { FormProps } from "./types";

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
  hashIndexing: "Placeholder help text for hash based indexing.",
  automaticInstallation:
    "Placeholder help text for automatic installation behavior.",
  automaticUpgrades: "Placeholder help text for automatic upgrades behavior.",
};

export const INITIAL_VALUES: FormProps = {
  name: "",
  source_type: "",
  source: "",
  publication_target: "",
  prefix: "",
  uploader_distribution: "",
  uploader_architectures: "",
  preserve_mirror_signing_key: true,
  mirror_signing_key: "",
  hash_indexing: false,
  automatic_installation: false,
  automatic_upgrades: false,
  skip_bz2: false,
  skip_content_indexing: false,
};
