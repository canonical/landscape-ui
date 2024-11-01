import { INPUT_DATE_FORMAT } from "@/constants";
import { SelectOption } from "@/types/SelectOption";
import moment from "moment";
import { FormProps } from "./types";

export const SNAPSHOT_START_DATE = "2023-02-28";
export const SNAPSHOT_TIMESTAMP_FORMAT = "YYYYMMDD[T]HHmmss[Z]";

export const INITIAL_VALUES: FormProps = {
  type: "ubuntu",
  name: "",
  distribution: "",
  mirror_series: "",
  mirror_uri: "",
  gpg_key: "",
  pockets: [],
  components: [],
  architectures: [],
  include_udeb: false,
  hasPockets: false,
  snapshotDate: moment().format(INPUT_DATE_FORMAT),
};

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
