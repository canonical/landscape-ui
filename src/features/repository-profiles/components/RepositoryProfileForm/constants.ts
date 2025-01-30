import type { RepositoryProfileFormValues } from "../../types";

export const INITIAL_VALUES: RepositoryProfileFormValues = {
  access_group: "",
  all_computers: false,
  apt_sources: [],
  description: "",
  pockets: [],
  tags: [],
  title: "",
};

export const CTA_INFO = {
  add: {
    ariaLabel: "Add a new repository profile",
    label: "Add repository profile",
  },
  edit: {
    ariaLabel: "Edit repository profile",
    label: "Save changes",
  },
};
