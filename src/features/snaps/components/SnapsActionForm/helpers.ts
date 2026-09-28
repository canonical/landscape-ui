import type { SnapAction, ActionWithNotification } from "../../types";

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
  // TODO: add filtering for multiple architectures notification on install / change,
  //  depending on how we decide to support that with the API
  action === "hold" || action === "install" || action === "change channel";
