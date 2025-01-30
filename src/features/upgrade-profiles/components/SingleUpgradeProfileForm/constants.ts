import type { FormProps } from "../../types";

export const CTA_LABELS = {
  add: "Add upgrade profile",
  edit: "Save changes",
};

export const INITIAL_VALUES: FormProps = {
  access_group: "",
  all_computers: false,
  at_hour: "",
  at_minute: "",
  autoremove: false,
  deliver_delay_window: "",
  deliver_within: 1,
  every: "week",
  on_days: [],
  randomizeDelivery: false,
  tags: [],
  title: "",
  upgrade_type: "all",
};

export const NOTIFICATION_ACTIONS = {
  add: "added",
  edit: "updated",
};
