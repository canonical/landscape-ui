import type { NotificationMethodArgs } from "@/types/Notification";
import type { Instance } from "@/types/Instance";
import { pluralize, getSelectionLabel } from "@/utils/_helpers";

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
    title: `Selected ${pluralize(selected.length, "instance has", { pluralForm: "instances have" })} been queued for ${action}.`,
    message: `${getSelectionLabel(selected, (instance) => `"${instance.title}" instance has`, `instances have`)} been queued in Activities for ${action}.`,
    actions: [
      {
        label: "View details",
        onClick: onDetailsClick,
      },
    ],
  };
};
