import type { RunScriptParams } from "../api";

export interface RunInstanceScriptFormValues
  extends Omit<RunScriptParams, "query"> {
  deliverImmediately: boolean;
}
