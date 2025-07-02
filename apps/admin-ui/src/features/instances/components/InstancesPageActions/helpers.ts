import type { NotificationMethodArgs } from "@/types/Notification";
import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";

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
    title: `Selected ${pluralize(selected.length, "instance has", "instances have")} been queued for ${action}.`,
    message: `${pluralize(selected.length, `"${selected[0]?.title ?? ""}" instance has`, `${selected.length} instances have`)} been queued in Activities for ${action}.`,
    actions: [
      {
        label: "View details",
        onClick: onDetailsClick,
      },
    ],
  };
};
