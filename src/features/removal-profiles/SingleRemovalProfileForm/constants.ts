import { FormProps } from "./types";

export const NOTIFICATION_ACTIONS = {
  create: "created",
  edit: "updated",
};

export const CTA_LABELS = {
  create: "Create removal profile",
  edit: "Save changes",
};

export const INITIAL_VALUES: FormProps = {
  access_group: "",
  all_computers: false,
  days_without_exchange: "",
  tags: [],
  title: "",
};
