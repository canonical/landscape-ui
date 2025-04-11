import type { ScriptProfile } from "./types";

export const getStatusText = (profile: ScriptProfile) =>
  profile.archived ? "Archived" : "Active";

export const getTriggerText = (profile: ScriptProfile) => {
  switch (profile.trigger.trigger_type) {
    case "event": {
      switch (profile.trigger.event_type) {
        case "post_enrollment": {
          return "Post enrollment";
        }

        default: {
          return;
        }
      }
    }

    case "one_time": {
      return "On a date";
    }

    case "recurring": {
      return "Recurring";
    }
  }
};
