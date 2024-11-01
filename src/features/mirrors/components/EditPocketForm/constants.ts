import { DEFAULT_MIRROR_URI } from "../../constants";
import { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  series: "",
  distribution: "",
  name: "",
  architectures: [],
  components: [],
  gpg_key: "",
  include_udeb: false,
  mirror_uri: DEFAULT_MIRROR_URI,
  upload_allow_unsigned: false,
  mirror_suite: "",
  mirror_gpg_key: "",
  filters: [],
  upload_gpg_keys: [],
};
