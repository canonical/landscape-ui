import { ordinal } from "@/components/form/ScheduleBlock/components/ScheduleBlockBase/helpers";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { NotificationHelper } from "@/types/Notification";
import { Icon } from "@canonical/react-components";
import moment from "moment";
import { Link } from "react-router";
import classes from "./helpers.module.scss";
import type { SecurityProfile } from "./types";
import type { SecurityProfileFormValues } from "./types/SecurityProfileAddFormValues";

export const phrase = (strings: string[] = []) => {
  return `${strings.slice(0, -1).join(", ")}${strings.length > 2 ? "," : ""}${strings.length > 1 ? " and " : ""}${strings.slice(-1)}`;
};

export const notifyCreation = (
  values: SecurityProfileFormValues,
  notify: NotificationHelper,
) => {
  const notificationMessageParts = ["perform an initial run"];

  if (values.mode != "audit") {
    notificationMessageParts.push(
      "apply remediation fixes on associated instances",
    );
  }

  if (values.mode == "audit-fix-restart") {
    notificationMessageParts.push("restart them");
  }

  notificationMessageParts.push("generate an audit");

  notify.success({
    title: `You have successfully created ${values.title} security profile.`,
    message: `This profile will ${phrase(notificationMessageParts)}.`,
  });
};

export const getAssociatedInstancesLink = (profile: SecurityProfile) => {
  const search = [`query=access-group-recursive%3A${profile.access_group}`];

  if (profile.tags.length) {
    search.push(`tags=${profile.tags.join("%2C")}`);
  }

  return profile.tags.length || profile.all_computers ? (
    <Link
      to={{
        pathname: "/instances",
        search: `?${search.join("&")}`,
      }}
    >
      {profile.associated_instances ?? 0}{" "}
      {profile.associated_instances === 1 ? "instance" : "instances"}
    </Link>
  ) : (
    <NoData />
  );
};

export const getTags = (profile: SecurityProfile) =>
  profile.all_computers
    ? "All instances"
    : profile.tags.join(", ") || <NoData />;

export const getTailoringFile = (profile: SecurityProfile) => {
  if (!profile.tailoring_file_uri) {
    return <NoData />;
  }

  const match = profile.tailoring_file_uri.match(/[^/]+$/);

  return (
    <div className={classes.container}>
      <div className={classes.truncated}>
        {match ? match[0] : "tailoring-file.xml"}
      </div>

      <a href={profile.tailoring_file_uri} download>
        <Icon name="begin-downloading" />
      </a>
    </div>
  );
};

export const getSchedule = (profile: SecurityProfile) => {
  const schedule = Object.fromEntries(
    profile.schedule.split(";").map((part) => part.split("=")),
  );

  if (schedule.COUNT == 1) {
    return "On a date";
  }

  let scheduleText = "Recurring, every ";

  if (schedule.INTERVAL > 1) {
    scheduleText += `${schedule.INTERVAL} `;
  }

  scheduleText += {
    DAILY: "day",
    WEEKLY: "week",
    MONTHLY: "month",
    YEARLY: "year",
  }[schedule.FREQ as string];

  if (schedule.INTERVAL > 1) {
    scheduleText += "s";
  }

  switch (schedule.FREQ) {
    case "WEEKLY": {
      scheduleText += ` on ${phrase(schedule.BYDAY.split(",").map((day: string) => ({ SU: "Sunday", MO: "Monday", TU: "Tuesday", WE: "Wednesday", TH: "Thursday", FR: "Friday", SA: "Saturday" })[day]))}`;
      break;
    }

    case "MONTHLY": {
      scheduleText += " on the ";

      if (schedule.BYMONTHDAY) {
        scheduleText += `${ordinal(schedule.BYMONTHDAY)} day`;
        break;
      }

      if (schedule.BYDAY) {
        scheduleText += `${
          {
            "1": "first",
            "2": "second",
            "3": "third",
            "4": "fourth",
            "-1": "last",
          }[(schedule.BYDAY as string).slice(0, -2)]
        } ${{ SU: "Sunday", MO: "Monday", TU: "Tuesday", WE: "Wednesday", TH: "Thursday", FR: "Friday", SA: "Saturday" }[(schedule.BYDAY as string).slice(-2)]}`;
      }

      break;
    }

    case "YEARLY": {
      scheduleText += ` in ${phrase(
        schedule.BYMONTH.split(",")
          .toSorted((a: number, b: number) => a - b)
          .map(
            (month: number) =>
              ({
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "Novebmer",
                12: "December",
              })[month],
          ),
      )}`;
      break;
    }
  }

  if (schedule.UNTIL) {
    scheduleText += ` until ${moment(schedule.UNTIL).format(DISPLAY_DATE_TIME_FORMAT)}`;
  }

  return scheduleText;
};
