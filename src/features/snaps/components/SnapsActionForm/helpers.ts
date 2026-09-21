import type {
  SnapAction,
  ConfirmableSnapAction,
  ActionWithNotification,
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

export const isConfirmableAction = (
  action: SnapAction,
): action is ConfirmableSnapAction =>
  action !== "unhold" && action !== "change channel";

export const hasNotification = (
  action: SnapAction,
): action is ActionWithNotification =>
  action === "hold" || action === "install";
