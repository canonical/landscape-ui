import type { NotificationMethodArgs } from "@/types/Notification";
import type { Instance } from "@/types/Instance";

type GetNotificationArgsFn = (params: {
  action: "reboot" | "shutdown";
  onDetailsClick: () => void;
  selected: Instance[];
}) => NotificationMethodArgs;

export const getNotificationArgs: GetNotificationArgsFn = ({
  action,
  onDetailsClick,
  selected,
}) => {
  return {
    title: `Selected ${selected.length > 1 ? "instances have" : "instance has"} been queued for ${action}.`,
    message: `${selected.length > 1 ? `${selected.length} instances have` : `"${selected[0].title}" instance has`} been queued in Activities for ${action}.`,
    actions: [
      {
        label: "View details",
        onClick: onDetailsClick,
      },
    ],
  };
};
