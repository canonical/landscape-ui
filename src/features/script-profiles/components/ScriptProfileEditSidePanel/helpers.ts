import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import type { ScriptProfile } from "../../types";

export const getScriptProfileEditFormInitialValues = (
  scriptProfile: ScriptProfile,
) => ({
  ...scriptProfile,
  interval: "",
  ...scriptProfile.trigger,
  start_after:
    scriptProfile.trigger.trigger_type == "recurring"
      ? moment(scriptProfile.trigger.start_after)
          .utc()
          .format(INPUT_DATE_TIME_FORMAT)
      : "",
  timestamp:
    scriptProfile.trigger.trigger_type == "one_time"
      ? moment(scriptProfile.trigger.timestamp)
          .utc()
          .format(INPUT_DATE_TIME_FORMAT)
      : "",
});
