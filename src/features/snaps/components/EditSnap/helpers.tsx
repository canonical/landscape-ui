import { formatCountableNoun } from "@/pages/dashboard/instances/[single]/tabs/users/UserPanelActionButtons/helpers";
import moment from "moment";
import * as Yup from "yup";
import { EditSnapType, getSnapUpgradeCounts } from "../../helpers";
import type { InstalledSnap } from "../../types";
import type { FormValidationSchemaShape } from "./types";

const commonValidationSchema = {
  deliver_immediately: Yup.string(),
  randomize_delivery: Yup.string(),
  deliver_delay_window: Yup.number().min(
    0,
    "Delivery delay must be greater than or equal to 0",
  ),
  deliver_after: Yup.string().test({
    test: (value) => {
      if (!value) {
        return true;
      }
      return moment(value).isValid();
    },
    message: "You have to enter a valid date and time",
  }),
};

export const getEditSnapValidationSchema = (
  type: EditSnapType,
): FormValidationSchemaShape => {
  switch (type) {
    case EditSnapType.Switch:
      return {
        ...commonValidationSchema,
        release: Yup.string().required("Release is required"),
      };
    case EditSnapType.Hold:
      return {
        ...commonValidationSchema,
        hold: Yup.string(),
        hold_until: Yup.string().test({
          test: (value) => {
            if (!value) {
              return true;
            }
            return moment(value).isValid();
          },
          message: "You have to enter a valid date and time",
        }),
      };
    default:
      return {
        ...commonValidationSchema,
      };
  }
};

const messages = {
  single: {
    [EditSnapType.Refresh]:
      "This will update {snapName} to the latest version available. Automatic updates will resume, and {snapName} will be upgraded based on the regular refresh schedule.",
    [EditSnapType.Uninstall]: "This will remove the Snap from your system",
    [EditSnapType.Hold]:
      "This will pause automatic updates for that particular snap. {snapName} will maintain the current version",
    [EditSnapType.Unhold]:
      "This will resume automatic updates for that particular Snap. {snapName} will be eligible for the latest version upgrades based on the regular refresh schedule.",
  },
  multiple: {
    [EditSnapType.Refresh]:
      "This will update the selected snaps to the latest version available. Automatic updates will resume, and the snaps will be upgraded based on the regular refresh schedule.",
    [EditSnapType.Uninstall]:
      "This will remove the selected snaps from your system",
    [EditSnapType.Hold]:
      "Holding a Snap will pause automatic updates for that particular snap.",
    [EditSnapType.Unhold]:
      "Unholding a Snap will resume automatic updates for that particular snap.",
  },
};

export const getSnapMessage = (
  type: EditSnapType,
  installedSnaps: InstalledSnap[],
) => {
  if (type === EditSnapType.Switch) {
    return null;
  }
  const { held, unheld } = getSnapUpgradeCounts(installedSnaps);
  const message = messages[installedSnaps.length === 1 ? "single" : "multiple"][
    type
  ].replaceAll("{snapName}", installedSnaps[0].snap.name);

  if (
    type === EditSnapType.Refresh ||
    type === EditSnapType.Uninstall ||
    installedSnaps.length === 1 ||
    held === 0 ||
    unheld === 0
  ) {
    return <p>{message}</p>;
  } else {
    return (
      <>
        <p>{message}</p>
        <span>You selected {installedSnaps.length} snaps. This will:</span>
        <ul>
          <li>
            {type === EditSnapType.Hold ? "hold" : "unhold"}{" "}
            {formatCountableNoun({
              count: type === EditSnapType.Hold ? unheld : held,
              singular: "snap",
            })}
          </li>
          <li>
            leave{" "}
            {formatCountableNoun({
              count: type === EditSnapType.Hold ? held : unheld,
              singular: "snap",
            })}{" "}
            {type === EditSnapType.Hold ? "held" : "unheld"}
          </li>
        </ul>
      </>
    );
  }
};

export const getSuccessMessage = (snapCount: number, action: EditSnapType) => {
  let verb = "";
  switch (action) {
    case EditSnapType.Refresh:
      verb = "refreshed";
      break;
    case EditSnapType.Uninstall:
      verb = "uninstalled";
      break;
    case EditSnapType.Hold:
      verb = "held";
      break;
    case EditSnapType.Unhold:
      verb = "unheld";
      break;
    default:
      break;
  }

  return `You queued ${snapCount} ${snapCount === 1 ? "snap" : "snaps"} to be ${verb}.`;
};
