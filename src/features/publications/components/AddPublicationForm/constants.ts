import type { SelectOption } from "@/types/SelectOption";
import type { FormProps } from "./types";

interface SourceOption {
  label: string;
  value: string;
  sourceType: "Mirror" | "Local repository";
  distribution: string;
  components: string[];
  architectures: string[];
}

export const SOURCE_TYPE_OPTIONS: SelectOption[] = [
  { label: "Select source type", value: "" },
  { label: "Mirror", value: "Mirror" },
  { label: "Local repository", value: "Local repository" },
];

export const SOURCE_OPTIONS: SourceOption[] = [
  {
    label: "Ubuntu archive mirror",
    value: "ubuntu-archive-mirror",
    sourceType: "Mirror",
    distribution: "jammy",
    components: ["main", "restricted", "universe", "multiverse"],
    architectures: ["amd64", "arm64"],
  },
  {
    label: "Security mirror",
    value: "ubuntu-security-mirror",
    sourceType: "Mirror",
    distribution: "noble",
    components: ["main", "universe"],
    architectures: ["amd64"],
  },
  {
    label: "Internal packages",
    value: "internal-packages",
    sourceType: "Local repository",
    distribution: "focal",
    components: ["main"],
    architectures: ["amd64", "arm64", "ppc64el"],
  },
];

export const PUBLICATION_TARGET_OPTIONS: SelectOption[] = [
  { label: "Select publication target", value: "" },
  { label: "Primary US mirror", value: "primary-us-mirror" },
  { label: "EMEA mirror", value: "emea-mirror" },
  { label: "Internal datacenter", value: "internal-datacenter" },
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
  uploader_components: "",
  uploader_architectures: "",
  preserve_mirror_signing_key: true,
  mirror_signing_key: "",
  hash_indexing: false,
  automatic_installation: false,
  automatic_upgrades: false,
  skip_bz2: false,
  skip_content_indexing: false,
};
