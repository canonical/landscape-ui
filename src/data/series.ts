import { SelectOption } from "../types/SelectOption";

export const POCKET_OPTIONS: SelectOption[] = [
  {
    label: "Release",
    value: "release",
  },
  {
    label: "Security",
    value: "security",
  },
  {
    label: "Updates",
    value: "updates",
  },
  {
    label: "Proposed",
    value: "proposes",
  },
  {
    label: "Backports",
    value: "backports",
  },
];

type PreSelected = Record<"ubuntu" | "thirdParty", string[]>;

export const PRE_SELECTED_POCKETS: PreSelected = {
  ubuntu: ["release", "security", "updates"],
  thirdParty: ["release"],
};

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

export const PRE_SELECTED_COMPONENTS: PreSelected = {
  ubuntu: ["main", "universe", "restricted", "multiverse"],
  thirdParty: ["main"],
};

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

export const PRE_SELECTED_ARCHITECTURES: PreSelected = {
  ubuntu: ["amd64"],
  thirdParty: ["amd64"],
};
