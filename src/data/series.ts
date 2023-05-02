import { getDefaultDistribution } from "./distributions";
import { SelectOption } from "../types/SelectOption";

interface CreatePocketParams {}

interface CreateComponentParams {}

interface CreateArchitecturesParams {}

interface CreateSeriesParams {
  name: string;
  distribution: string;
  pockets?: CreatePocketParams[];
  components?: CreateComponentParams[];
  architectures?: CreateArchitecturesParams[];
  mirror_gpg_key?: string;
  mirror_uri?: string;
  mirror_series?: string[];
  include_udeb?: boolean;
}

const PRE_DEFINED_SERIES: CreateSeriesParams[] = [
  {
    name: "lucid",
    distribution: getDefaultDistribution().name,
  },
  {
    name: "natty",
    distribution: getDefaultDistribution().name,
  },
];

export const PRE_DEFIED_SERIES_OPTIONS: SelectOption[] = PRE_DEFINED_SERIES.map(
  (item) => ({
    value: item.name,
    label: `${item.distribution} ${item.name}`,
  })
);

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

export const PRE_SELECTED_POCKETS: string[] = [
  "release",
  "security",
  "updates",
];

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

export const PRE_SELECTED_COMPONENTS: string[] = [
  "main",
  "universe",
  "restricted",
  "multiverse",
];

export const ARCHITECTURE_OPTIONS: SelectOption[] = [
  {
    label: "amd64",
    value: "amd64",
  },
  {
    label: "riscv",
    value: "riscv",
  },
  {
    label: "i386",
    value: "i386",
  },
  {
    label: "armhf",
    value: "armhf",
  },
];

export const PRE_SELECTED_ARCHITECTURES: string[] = ["amd64"];
