import type { SelectOption } from "@/types/SelectOption";
import {
  DEFAULT_MIRROR_URI,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
} from "../../constants";
import type { FormProps } from "./types";

export const PRE_DEFINED_POCKET_MODE_OPTIONS: SelectOption[] = [
  {
    label: "Mirror",
    value: "mirror",
  },
  {
    label: "Pull",
    value: "pull",
  },
  {
    label: "Upload",
    value: "upload",
  },
];

export const INITIAL_VALUES: FormProps = {
  type: "ubuntu",
  series: "",
  distribution: "",
  name: "",
  architectures: PRE_SELECTED_ARCHITECTURES.ubuntu,
  components: PRE_SELECTED_COMPONENTS.ubuntu,
  gpg_key: "",
  include_udeb: false,
  filter_type: "",
  mode: "mirror",
  pull_pocket: "",
  pull_series: "",
  mirror_uri: DEFAULT_MIRROR_URI,
  upload_allow_unsigned: false,
  mirror_suite: "",
  mirror_gpg_key: "",
  filter_packages: [],
  upload_gpg_keys: [],
};

export const filterTypeOptions: SelectOption[] = [
  { label: "Select filter type", value: "" },
  { label: "Allow list", value: "whitelist" },
  { label: "Disallow list", value: "blacklist" },
];
