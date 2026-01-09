import type { RunScriptParams } from "../../api";
import type { Script } from "../../types";

export interface FormProps
  extends CreateScriptParams, Omit<RunScriptParams, "query"> {
  deliver_immediately: boolean;
  deliver_after: string;
  script: Script | null;
}
