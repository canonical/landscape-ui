import { Activity } from "../../../types/Activity";

export const isActivity = (obj: unknown): obj is Activity => {
  return (
    typeof obj === "object" &&
    null !== obj &&
    "activity_status" in obj &&
    "string" === typeof obj.activity_status &&
    "summary" in obj &&
    "string" === typeof obj.summary
  );
};
