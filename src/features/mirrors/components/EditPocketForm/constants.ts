import { UBUNTU_ARCHIVE_SOURCE_URL } from "../../constants";
import type { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  series: "",
  distribution: "",
  name: "",
  architectures: [],
  components: [],
  gpg_key: "",
  include_udeb: false,
  mirror_uri: UBUNTU_ARCHIVE_SOURCE_URL,
  upload_allow_unsigned: false,
  mirror_suite: "",
  mirror_gpg_key: "",
  filters: [],
  upload_gpg_keys: [],
};
