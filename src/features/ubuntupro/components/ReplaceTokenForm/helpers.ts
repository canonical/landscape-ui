import type { NotificationMethodArgs } from "@/types/Notification";

export const getReplaceFormNotification = (
  selectedInstancesLength: number,
  instanceName?: string,
): NotificationMethodArgs => {
  if (selectedInstancesLength === 1) {
    return {
      title: `You queued Ubuntu Pro token replacement for ${instanceName ?? "instance"}.`,
      message:
        "The existing Ubuntu Pro token will be replaced for this instance. You can track progress in Activities.",
    };
  }

  return {
    title: `You queued Ubuntu Pro token replacement for ${selectedInstancesLength} instances.`,
    message: `The existing Ubuntu Pro token will be replaced across all selected instances. You can track progress in Activities.`,
  };
};
