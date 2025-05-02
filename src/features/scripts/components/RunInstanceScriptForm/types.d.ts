import type { RunScriptParams } from "../../api";
import type { Script } from "../../types";

export interface FormProps
  extends CreateScriptParams,
    Omit<RunScriptParams, "query"> {
  deliverImmediately: boolean;
  script: Script | null;
}
