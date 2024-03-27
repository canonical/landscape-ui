import { FormProps } from "./types";

export const NOTIFICATION_ACTIONS = {
  add: "added",
  create: "created",
  edit: "updated",
};

export const CTA_LABELS = {
  add: "Add",
  create: "Create",
  edit: "Update",
};

export const INITIAL_VALUES: FormProps = {
  access_group: "",
  all_computers: false,
  days_without_exchange: "",
  tags: [],
  title: "",
};
