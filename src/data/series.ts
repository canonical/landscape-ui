import { SelectOption } from "../types/SelectOption";

// interface CreatePocketParams {}
//
// interface CreateComponentParams {}
//
// interface CreateArchitecturesParams {}

interface SeriesData {
  label: string;
  slug: string;
}

const PRE_DEFINED_SERIES: SeriesData[] = [
  {
    label: "Ubuntu 14.04.6 LTS (Trusty Tahr)",
    slug: "trusty",
  },
  {
    label: "Ubuntu 16.04.7 LTS (Xenial Xerus)",
    slug: "xenial",
  },
  {
    label: "Ubuntu 18.04.6 LTS (Bionic Beaver)",
    slug: "bionic",
  },
  {
    label: "Ubuntu 20.04.6 LTS (Focal Fossa)",
    slug: "focal",
  },
  {
    label: "Ubuntu 22.04.1 LTS (Jammy Jellyfish)",
    slug: "jammy",
  },
  {
    label: "Ubuntu 22.10 (Kinetic Kudu)",
    slug: "kinetic",
  },
  {
    label: "Ubuntu 23.04 (Lunar Lobster)",
    slug: "lunar",
  },
];

export const PRE_DEFIED_SERIES_OPTIONS: SelectOption[] =
  PRE_DEFINED_SERIES.reverse().map((item) => ({
    value: item.slug,
    label: item.label,
  }));

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
