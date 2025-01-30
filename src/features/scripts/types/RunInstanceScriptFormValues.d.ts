import type { CreateScriptParams, ExecuteScriptParams } from "../hooks";

export interface RunInstanceScriptFormValues
  extends CreateScriptParams,
    Omit<ExecuteScriptParams, "query"> {
  attachments: {
    first: File | null;
    second: File | null;
    third: File | null;
    fourth: File | null;
    fifth: File | null;
  };
  deliverImmediately: boolean;
  saveScript: boolean;
  type: "new" | "existing";
}
