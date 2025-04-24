import type { CreateScriptParams, RunScriptParams } from "../../api";

export interface FormProps
  extends CreateScriptParams,
    Omit<RunScriptParams, "query"> {
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
