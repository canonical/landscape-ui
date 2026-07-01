import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import type { ScriptProfileFormValues } from "../ScriptProfileForm/types";

export const SCRIPT_PROFILE_ADD_SIDE_PANEL_INITIAL_VALUES: ScriptProfileFormValues =
  {
    all_computers: false,
    interval: "",
    start_after: date().utc().format(INPUT_DATE_TIME_FORMAT),
    tags: [],
    time_limit: 300,
    timestamp: date().utc().format(INPUT_DATE_TIME_FORMAT),
    title: "",
    trigger_type: "",
    username: "root",
    script: null,
  };
