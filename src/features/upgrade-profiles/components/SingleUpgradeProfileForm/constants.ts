import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import type { FormProps } from "../../types";

export const CTA_LABELS = {
  add: "Add upgrade profile",
  edit: "Save changes",
};

export const INITIAL_VALUES: FormProps = {
  access_group: DEFAULT_ACCESS_GROUP_NAME,
  all_computers: false,
  at_hour: "",
  at_minute: "",
  autoremove: false,
  deliver_delay_window: 0,
  deliver_within: 1,
  every: "week",
  on_days: [],
  randomize_delivery: false,
  tags: [],
  title: "",
  upgrade_type: "all",
};

export const NOTIFICATION_ACTIONS = {
  add: "added",
  edit: "updated",
};
