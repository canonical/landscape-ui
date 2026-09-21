import type {
  ConfirmableSnapAction,
  InstalledSnapWithCount,
} from "../../../../types";
import { capitalize, pluralize } from "@/utils/_helpers";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./ConfirmSnapActionModal.module.scss";

interface ConfirmSnapActionModalProps {
  readonly actionVerb: ConfirmableSnapAction;
  readonly snaps: InstalledSnapWithCount[];
  readonly instancesCount: number;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly isSubmitting: boolean;
}

const ConfirmSnapActionModal: FC<ConfirmSnapActionModalProps> = ({
  actionVerb,
  snaps,
  instancesCount,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  const snapsText = `${capitalize(actionVerb)} ${pluralize(snaps.length, ["snap"], "exact")}`;

  const getTitle = () => {
    const instancesText = pluralize(instancesCount, ["instance"], "exact");
    const actionPreposition = actionVerb === "uninstall" ? "from" : "on";

    return `${snapsText} ${actionPreposition} ${instancesText}`;
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
    }
  };

  const buttonColor = actionVerb === "uninstall" ? "negative" : "positive";

  return (
    <ConfirmationModal
      close={onClose}
      title={getTitle()}
      confirmButtonLabel={snapsText}
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
