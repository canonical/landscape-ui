import type { CreateScriptParams } from "../api";

export interface ScriptFormValues extends CreateScriptParams {
  attachments: {
    first: File | null;
    second: File | null;
    third: File | null;
    fourth: File | null;
    fifth: File | null;
  };
  attachmentsToRemove: string[];
}
