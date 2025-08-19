import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import type { ScriptProfileFormValues } from "../ScriptProfileForm/types";

export const SCRIPT_PROFILE_ADD_FORM_INITIAL_VALUES: ScriptProfileFormValues = {
  all_computers: false,
  interval: "",
  start_after: moment().utc().format(INPUT_DATE_TIME_FORMAT),
  tags: [],
  time_limit: 300,
  timestamp: moment().utc().format(INPUT_DATE_TIME_FORMAT),
  title: "",
  trigger_type: "",
  username: "root",
  script: null,
};
