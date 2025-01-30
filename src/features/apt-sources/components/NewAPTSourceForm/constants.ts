import type { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  name: "",
  apt_line: "",
  gpg_key: "",
  access_group: "",
};

export const APT_LINE_TOOLTIP = `Enter 'deb', followed by the URI for the repository mirror, distribution and components. An example entry could be 'deb http://landscape-repo-mirror/repository/standalone/ubuntu jammy main universe restricted multiverse'`;
