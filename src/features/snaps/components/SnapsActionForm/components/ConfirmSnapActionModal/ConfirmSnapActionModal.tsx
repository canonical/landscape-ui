import type {
  SnapAction,
  SnapChangeMode,
  InstalledSnapWithCount,
} from "../../../../types";
import { capitalize, pluralize } from "@/utils/_helpers";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./ConfirmSnapActionModal.module.scss";

interface ConfirmSnapActionModalProps {
  readonly actionVerb: SnapAction;
  readonly snaps: InstalledSnapWithCount[];
  readonly changeModes?: SnapChangeMode[];
  readonly instancesCount: number;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly isSubmitting: boolean;
  readonly submitText: string;
}

const ConfirmSnapActionModal: FC<ConfirmSnapActionModalProps> = ({
  actionVerb,
  snaps,
  changeModes = [],
  instancesCount,
  onClose,
  onConfirm,
  isSubmitting,
  submitText,
}) => {
  const isChangeChannel = actionVerb === "change channel";
  const hasChannelMode = changeModes.includes("channel");
  const hasRevisionMode = changeModes.includes("revision");
  const isMixedChangeMode = hasChannelMode && hasRevisionMode;

  const getChangeChannelVerb = () => {
    if (isMixedChangeMode) {
      return "change channel or revision";
    }
    if (hasRevisionMode) {
      return "change revision";
    }
    return "change channel";
  };

  const getTitle = () => {
    const snapsText = pluralize(snaps.length, ["snap"], "exact");
    const instancesText = pluralize(instancesCount, ["instance"], "exact");

    if (isChangeChannel) {
      return `${capitalize(getChangeChannelVerb())} of ${snapsText} on ${instancesText}`;
    }

    switch (actionVerb) {
      case "uninstall":
        return `Uninstall ${snapsText} from ${instancesText}`;
      default:
        return `${capitalize(actionVerb)} ${snapsText} on ${instancesText}`;
    }
  };

  const getWarningText = () => {
    if (isChangeChannel) {
      if (isMixedChangeMode) {
        return "Snaps set to a channel will update to that channel's latest revision. Snaps set to a specific revision will keep tracking their current channel, so a future refresh may replace it with that channel's latest revision.";
      }
      if (hasRevisionMode) {
        return "Installing the specified revision will not change the snap's tracked channel, so a future refresh may replace it with that channel's latest revision.";
      }
      return "Changing the channel will update the snap to the latest revision on the new channel.";
    }

    switch (actionVerb) {
      case "refresh":
        return "Landscape will check each of the selected instances for a newer revision on the channel that snap is currently tracking, and install it where one is found.";
      case "uninstall":
        return (
          <strong>
            These will be queued to uninstall from all relevant instances.
          </strong>
        );
      case "hold":
        return "Landscape will hold all refreshes from the moment the client executes the activity. If the snap was already held, Landscape will replace the existing hold with an indefinite one.";
      case "install":
        return "By installing these, you acknowledge that these snaps may have access to your files and system. Only install snaps in classic confinement if you trust the publisher.";
      case "unhold":
        return "Each refresh will now update the snap to the latest revision on the current channel.";
    }
  };

  const buttonColor = actionVerb === "uninstall" ? "negative" : "positive";

  return (
    <ConfirmationModal
      close={onClose}
      title={getTitle()}
      confirmButtonLabel={submitText}
      confirmButtonAppearance={buttonColor}
      cancelButtonProps={{ appearance: "base", disabled: isSubmitting }}
      onConfirm={onConfirm}
      confirmButtonLoading={isSubmitting}
      renderInPortal
    >
      <p className={classes.summary}>
        The following snaps have been selected to{" "}
        {isChangeChannel ? getChangeChannelVerb() : actionVerb}:
      </p>
      <ul>
        {snaps.map(({ snap }) => (
          <li key={snap.name}>{snap.name}</li>
        ))}
      </ul>
      <p className={classes.warning}>{getWarningText()}</p>
    </ConfirmationModal>
  );
};

export default ConfirmSnapActionModal;
