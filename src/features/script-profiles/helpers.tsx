import { toCronPhrase } from "@/components/form/CronSchedule/components/CronSchedule/helpers";
import NoData from "@/components/layout/NoData";
import { Link } from "react-router";
import classes from "./helpers.module.scss";
import type { ScriptProfile } from "./types";
import { pluralize } from "@/utils/_helpers";

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
      return `Recurring`;
    }
  }
};

export const getTriggerLongText = (profile: ScriptProfile) => {
  switch (profile.trigger.trigger_type) {
    case "recurring": {
      return `Recurring, ${toCronPhrase(profile.trigger.interval)}`;
    }

    default:
      return getTriggerText(profile);
  }
};

export const getAssociatedInstancesLink = (profile: ScriptProfile) => {
  const search = [`query=access-group-recursive%3A${profile.access_group}`];

  if (profile.tags.length) {
    search.push(`tags=${profile.tags.join("%2C")}`);
  }

  return profile.tags.length || profile.all_computers ? (
    <Link
      className={classes.link}
      to={{
        pathname: "/instances",
        search: `?${search.join("&")}`,
      }}
    >
      {profile.computers.num_associated_computers ?? 0}{" "}
      {pluralize(profile.computers.num_associated_computers, "instance")}
    </Link>
  ) : (
    <NoData />
  );
};
