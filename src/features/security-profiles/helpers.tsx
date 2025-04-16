import NoData from "@/components/layout/NoData";
import type { NotificationHelper } from "@/types/Notification";
import { Icon } from "@canonical/react-components";
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
    actions: [
      {
        label: "View details",
        onClick: () => {
          console.warn("PLACEHOLDER");
        },
      },
    ],
  });
};

export const getAssociatedInstancesLink = (profile: SecurityProfile) =>
  profile.tags.length || profile.all_computers ? (
    <Link
      to={{
        pathname: "/instances",
        search: `?tags=${profile.tags.join("%2C")}`,
      }}
    >
      {profile.associated_instances ?? 0}{" "}
      {profile.associated_instances === 1 ? "instance" : "instances"}
    </Link>
  ) : (
    "0 instances"
  );

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
