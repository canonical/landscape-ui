import type { Script } from "@/features/scripts";
import type { ScriptProfile } from "../../types";

export interface ScriptProfileFormValues
  extends Pick<
      ScriptProfile,
      "all_computers" | "title" | "tags" | "time_limit" | "username"
    >,
    Partial<Pick<ScriptProfile, "script_id">> {
  interval: string;
  start_after: string;
  timestamp: string;
  trigger_type: ScriptProfile["trigger"]["trigger_type"] | "";
  script?: Script | null;
}
