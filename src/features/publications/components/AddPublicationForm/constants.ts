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

export const INITIAL_VALUES: FormProps = {
  name: "",
  sourceType: "",
  source: "",
  publicationTarget: "",
  prefix: "",
  uploaderDistribution: "",
  uploaderArchitectures: [],
  signingKey: "",
  hashIndexing: false,
  limitAutomaticInstallation: false,
  automaticUpgrades: false,
  skipBz2: false,
  skipContentIndexing: false,
};
