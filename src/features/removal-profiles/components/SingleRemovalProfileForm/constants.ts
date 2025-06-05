import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import type { FormProps } from "./types";

export const NOTIFICATION_ACTIONS = {
  add: "Add",
  edit: "updated",
};

export const CTA_LABELS = {
  add: "Add removal profile",
  edit: "Save changes",
};

export const INITIAL_VALUES: FormProps = {
  access_group: DEFAULT_ACCESS_GROUP_NAME,
  all_computers: false,
  days_without_exchange: "",
  tags: [],
  title: "",
};
