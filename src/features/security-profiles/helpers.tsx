import type { NotificationHelper } from "@/types/Notification";
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
