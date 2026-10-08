import type { SnapAction, ActionWithNotification, SnapMode } from "../../types";

export const getRequestAction = (action: SnapAction) => {
  switch (action) {
    case "uninstall":
      return "remove";
    case "change channel":
      return "refresh";
    default:
      return action;
  }
};

export const hasNotification = (
  action: SnapAction,
): action is ActionWithNotification => action === "hold";

export const isRevisionNotificationAction = (
  action: SnapAction,
): action is Extract<SnapAction, "install" | "change channel"> =>
  action === "install" || action === "change channel";

export const getChangeChannelVerb = (changeModes: SnapMode[] = []): string => {
  const hasChannelMode = changeModes.includes("channel");
  const hasRevisionMode = changeModes.includes("revision");

  if (hasChannelMode && hasRevisionMode) {
    return "change channel or revision";
  }
  if (hasRevisionMode) {
    return "change revision";
  }
  return "change channel";
};

export const getActionVerb = (
  action: SnapAction,
  changeModes: SnapMode[] = [],
): string => {
  if (action === "change channel") {
    return getChangeChannelVerb(changeModes);
  }
  return action;
};
