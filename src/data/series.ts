import { SelectOption } from "@/types/SelectOption";

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
    value: "proposed",
  },
  {
    label: "Backports",
    value: "backports",
  },
];

type PreSelected = Record<"pro" | "thirdParty" | "ubuntu", string[]>;

export const PRE_SELECTED_POCKETS: PreSelected = {
  pro: ["security", "updates"],
  thirdParty: ["release"],
  ubuntu: ["release", "security", "updates"],
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
  pro: ["main"],
  thirdParty: ["main"],
  ubuntu: ["main", "universe", "restricted", "multiverse"],
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
  pro: ["amd64", "i386"],
  thirdParty: ["amd64"],
  ubuntu: ["amd64"],
};

export const UBUNTU_PRO_CATEGORY_OPTIONS: SelectOption[] = [
  {
    label: "Apps",
    value: "https://esm.ubuntu.com/apps/ubuntu",
  },
  {
    label: "CC",
    value: "https://esm.ubuntu.com/cc/ubuntu",
  },
  {
    label: "CIS",
    value: "https://esm.ubuntu.com/cis/ubuntu",
  },
  {
    label: "FIPS",
    value: "https://esm.ubuntu.com/fips/ubuntu",
  },
  {
    label: "FIPS Preview",
    value: "https://esm.ubuntu.com/fips-preview/ubuntu",
  },
  {
    label: "FIPS Updates",
    value: "https://esm.ubuntu.com/fips-updates/ubuntu",
  },
  {
    label: "Infra",
    value: "https://esm.ubuntu.com/infra/ubuntu",
  },
  {
    label: "Infra Legacy",
    value: "https://esm.ubuntu.com/infra-legacy/ubuntu",
  },
  {
    label: "Realtime",
    value: "https://esm.ubuntu.com/realtime/ubuntu",
  },
  {
    label: "ROS",
    value: "https://esm.ubuntu.com/ros/ubuntu",
  },
  {
    label: "ROS Updates",
    value: "https://esm.ubuntu.com/ros-updates/ubuntu",
  },
];
