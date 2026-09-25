import type { SnapAction, InstalledSnapWithCount } from "../../../../types";
import { capitalize, pluralize } from "@/utils/_helpers";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./ConfirmSnapActionModal.module.scss";

interface ConfirmSnapActionModalProps {
  readonly actionVerb: SnapAction;
  readonly snaps: InstalledSnapWithCount[];
  readonly instancesCount: number;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly isSubmitting: boolean;
  readonly submitText: string;
}

const ConfirmSnapActionModal: FC<ConfirmSnapActionModalProps> = ({
  actionVerb,
  snaps,
  instancesCount,
  onClose,
  onConfirm,
  isSubmitting,
  submitText,
}) => {
  const getTitle = () => {
    const snapsText = pluralize(snaps.length, ["snap"], "exact");
    const instancesText = pluralize(instancesCount, ["instance"], "exact");

    switch (actionVerb) {
      case "change channel":
        return `Change channel of ${snapsText} on ${instancesText}`;
      case "uninstall":
        return `Uninstall ${snapsText} from ${instancesText}`;
      default:
        return `${capitalize(actionVerb)} ${snapsText} on ${instancesText}`;
    }
  };

  const getWarningText = () => {
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
      case "change channel":
        return "Changing the channel will update the snap to the latest revision on the new channel.";
    }
  };

  const buttonColor = actionVerb === "uninstall" ? "negative" : "positive";

  return (
    <ConfirmationModal
      close={onClose}
      title={getTitle()}
      confirmButtonLabel={submitText}
      confirmButtonAppearance={buttonColor}
      cancelButtonProps={{ appearance: "base" }}
      onConfirm={onConfirm}
      confirmButtonLoading={isSubmitting}
      renderInPortal
    >
      <p className={classes.summary}>
        The following snaps have been selected to {actionVerb}:
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
