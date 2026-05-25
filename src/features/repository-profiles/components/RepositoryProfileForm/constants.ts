import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import type { RepositoryProfileFormValues } from "../../types";

export const INITIAL_VALUES: RepositoryProfileFormValues = {
  access_group: DEFAULT_ACCESS_GROUP_NAME,
  all_computers: false,
  apt_sources: [],
  description: "",
  tags: [],
  title: "",
};

export const CTA_INFO = {
  add: {
    ariaLabel: "Add a new repository profile",
    label: "Add profile",
  },
  edit: {
    ariaLabel: "Save changes to repository profile",
    label: "Save changes",
  },
};
