import type { SnapAction, ConfirmableSnapAction } from "../../types";

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
