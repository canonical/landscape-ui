import { pluralize } from "@/utils/_helpers";
import type { NotificationMethodArgs } from "@/types/Notification";

export const getAttachFormNotification = (
  withToken: number,
  withoutToken: number,
  selectedInstancesLength: number,
  instanceName?: string,
): NotificationMethodArgs => {
  if (selectedInstancesLength === 1) {
    return {
      title: `You queued attachment of Ubuntu Pro token for ${instanceName ?? "instance"}.`,
      message:
        "Your instance will soon be connected to an Ubuntu Pro entitlement, unlocking more security updates and benefits from Canonical.",
    };
  }

  if (withToken === 0) {
    return {
      title: `You queued token attachment for ${selectedInstancesLength} instances.`,
      message: `The token will be added to all ${selectedInstancesLength} instances. You can track progress in Activities.`,
    };
  }

  return {
    title: `You queued token attachment for ${selectedInstancesLength} instances.`,
    message: `The token will be added to ${withoutToken} ${pluralize(withoutToken, "instance")} and replace the existing one on ${withToken} ${pluralize(withToken, "instance")}. You can track progress in Activities.`,
  };
};
