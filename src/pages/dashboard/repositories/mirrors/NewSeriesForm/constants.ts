import moment from "moment/moment";
import { INPUT_DATE_FORMAT } from "@/constants";
import { FormProps } from "./types";
import { SelectOption } from "@/types/SelectOption";
import {
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
  PRE_SELECTED_POCKETS,
} from "@/data/series";

export const INITIAL_VALUES: FormProps = {
  architectures: PRE_SELECTED_ARCHITECTURES.ubuntu,
  components: PRE_SELECTED_COMPONENTS.ubuntu,
  distribution: "",
  gpg_key: "",
  include_udeb: false,
  mirror_gpg_key: "",
  mirror_series: "",
  mirror_uri: "",
  name: "",
  pockets: PRE_SELECTED_POCKETS.ubuntu,
  snapshotDate: moment().format(INPUT_DATE_FORMAT),
  token: "",
  type: "ubuntu",
};

export const TYPE_OPTIONS: (SelectOption &
  Record<"value", FormProps["type"]>)[] = [
  { label: "Ubuntu Archive", value: "ubuntu" },
  { label: "Ubuntu Pro", value: "ubuntu-pro" },
  { label: "Ubuntu Snapshot", value: "ubuntu-snapshot" },
  { label: "Third Party", value: "third-party" },
];

export const CATEGORIES_LABELS: Record<string, string> = {
  apps: "Apps",
  cc: "CC",
  cis: "CIS",
  fips: "FIPS",
  "fips-preview": "FIPS Preview",
  "fips-updates": "FIPS Updates",
  infra: "Infra",
  "infra-legacy": "Infra Legacy",
  realtime: "Realtime",
  ros: "ROS",
  "ros-updates": "ROS Updates",
};
