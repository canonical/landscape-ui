import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import type { ScriptProfile } from "../../types";

export const getScriptProfileEditFormInitialValues = (
  scriptProfile: ScriptProfile,
) => ({
  ...scriptProfile,
  interval: "",
  ...scriptProfile.trigger,
  start_after:
    scriptProfile.trigger.trigger_type == "recurring"
      ? date(scriptProfile.trigger.start_after)
          .utc()
          .format(INPUT_DATE_TIME_FORMAT)
      : "",
  timestamp:
    scriptProfile.trigger.trigger_type == "one_time"
      ? date(scriptProfile.trigger.timestamp)
          .utc()
          .format(INPUT_DATE_TIME_FORMAT)
      : "",
});
