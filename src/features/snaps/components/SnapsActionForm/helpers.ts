import type {
  SnapAction,
  ActionWithNotification,
  SnapChangeMode,
} from "../../types";

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
): action is ActionWithNotification =>
  action === "hold" || action === "install" || action === "change channel";

export const getChangeChannelVerb = (
  changeModes: SnapChangeMode[] = [],
): string => {
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
  changeModes: SnapChangeMode[] = [],
): string => {
  if (action === "change channel") {
    return getChangeChannelVerb(changeModes);
  }
  return action;
};
