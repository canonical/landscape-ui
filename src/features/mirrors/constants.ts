import type { SelectOption } from "@/types/SelectOption";
import type { PreSelected } from "./types/FormTypes";

export const UBUNTU_ARCHIVE_HOST = "archive.ubuntu.com";
export const UBUNTU_SNAPSHOTS_HOST = "snapshot.ubuntu.com";
export const UBUNTU_PRO_HOST = "esm.ubuntu.com";

export const UBUNTU_ARCHIVE_SOURCE_URL = `http://${UBUNTU_ARCHIVE_HOST}/ubuntu/`;

export const PRE_SELECTED_COMPONENTS: PreSelected = {
  ubuntu: ["main", "universe", "restricted", "multiverse"],
  thirdParty: ["main"],
};

export const PRE_SELECTED_ARCHITECTURES: PreSelected = {
  ubuntu: ["amd64"],
  thirdParty: ["amd64"],
};

export const PRE_SELECTED_POCKETS = {
  ubuntu: ["release", "security", "updates"],
  thirdParty: ["release"],
} as const satisfies PreSelected;

export const COMPONENT_OPTIONS: SelectOption[] = [
  {
    label: "Main",
    value: "main",
  },
  {
    label: "Universe",
    value: "universe",
  },
  {
    label: "Restricted",
    value: "restricted",
  },
  {
    label: "Multiverse",
    value: "multiverse",
  },
];

export const ARCHITECTURE_OPTIONS: SelectOption[] = [
  {
    label: "amd64",
    value: "amd64",
  },
  {
    label: "i386",
    value: "i386",
  },
];

export const MIN_SELECTION_COUNT = 1;
