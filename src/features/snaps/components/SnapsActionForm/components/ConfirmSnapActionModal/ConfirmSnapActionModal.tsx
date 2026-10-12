import type {
  SnapAction,
  SnapChangeMode,
  InstalledSnapWithCount,
} from "../../../../types";
import { capitalize, pluralize } from "@/utils/_helpers";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./ConfirmSnapActionModal.module.scss";
import { getChangeChannelVerb } from "../../helpers";

interface SnapChangeConfig {
  confinement?: string;
  mode: SnapChangeMode;
  value: string;
  channel?: string;
}

interface ConfirmSnapActionModalProps {
  readonly actionVerb: SnapAction;
  readonly snaps: InstalledSnapWithCount[];
  readonly changeModes?: SnapChangeMode[];
  readonly instancesCount: number;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly isSubmitting: boolean;
  readonly submitText: string;
  readonly snapChangeConfigs?: Record<string, SnapChangeConfig>;
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
  snapChangeConfigs = {},
}) => {
  const isChangeChannel = actionVerb === "change channel";
  const hasChannelMode = changeModes.includes("channel");
  const hasRevisionMode = changeModes.includes("revision");
  const isMixedChangeMode = hasChannelMode && hasRevisionMode;
  const changeChannelVerb = getChangeChannelVerb(changeModes);

  // A missing config entry means the snap was never touched by the user.
  // For change channel, that only happens when no channel data was
  // available to pick a default from (the "Default channel" case, mirrored
  // by the fallback default in SnapsActionForm.tsx), so it must default to
  // channel mode with no channel selected rather than being read as
  // "not classic". Other actions never populate snapChangeConfigs at all,
  // so this default must stay scoped to change channel.
  const isClassic = (snap: InstalledSnapWithCount) => {
    const config = snapChangeConfigs[snap.snap.id];

    if (config?.confinement === "classic") {
      return true;
    }

    return (
      isChangeChannel &&
      (config?.mode ?? "channel") === "channel" &&
      !config?.channel
    );
  };

  const classicSnaps = snaps.filter(isClassic);

  // Whenever any selected snap requires classic confinement, that takes
  // over the title, summary list, and info text regardless of action
  // (install, change channel, etc.), since it is the dominant concern for
  // the user to confirm. Change channel additionally keeps its
  // mode-specific guidance (revision vs. channel tracking behavior) below
  // the classic-confinement warning.
  const hasClassicSnaps = classicSnaps.length > 0;

  const snapsToShow = hasClassicSnaps ? classicSnaps : snaps;

  const getTitle = () => {
    if (hasClassicSnaps) {
      return `${pluralize(
        snapsToShow.length,
        [
          `of ${pluralize(snaps.length, ["snap"], "exact")} requires`,
          `of ${pluralize(snaps.length, ["snap"], "exact")} require`,
        ],
        "exact",
      )} classic confinement`;
    }

    const snapsText = pluralize(snaps.length, ["snap"], "exact");
    const instancesText = pluralize(instancesCount, ["instance"], "exact");

    if (isChangeChannel) {
      return `${capitalize(changeChannelVerb)} of ${snapsText} on ${instancesText}`;
    }

    switch (actionVerb) {
      case "uninstall":
        return `Uninstall ${snapsText} from ${instancesText}`;
      default:
        return `${capitalize(actionVerb)} ${snapsText} on ${instancesText}`;
    }
  };

  const getInfoText = () => {
    const snapWord = pluralize(snapsToShow.length, ["snap"], "none");

    if (hasClassicSnaps) {
      const requireWord = pluralize(
        snapsToShow.length,
        ["requires", "require"],
        "none",
      );
      return `The following ${snapWord} you selected ${requireWord} classic confinement`;
    }

    const hasWord = pluralize(snapsToShow.length, ["has", "have"], "none");
    return `The following ${snapWord} ${hasWord} been selected to ${isChangeChannel ? changeChannelVerb : actionVerb}`;
  };

  const getChangeChannelModeText = () => {
    if (isMixedChangeMode) {
      return "Snaps set to a channel will update to that channel's latest revision. Snaps set to a specific revision will keep tracking their current channel, so a future refresh may replace it with that channel's latest revision.";
    }
    if (hasRevisionMode) {
      return "Installing the specified revision will not change the snap's tracked channel, so a future refresh may replace it with that channel's latest revision.";
    }
    return "Changing the channel will update the snap to the latest revision on the new channel.";
  };

  const getWarningText = () => {
    if (hasClassicSnaps) {
      return (
        <>
          <strong>
            By proceeding, you acknowledge that{" "}
            {pluralize(classicSnaps.length, ["it", "they"], "none")} may have
            access to your files and system.
          </strong>{" "}
          Only use classic confinement if you trust the publisher.
        </>
      );
    }

    if (isChangeChannel) {
      return getChangeChannelModeText();
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
      close={isSubmitting ? undefined : onClose}
      title={getTitle()}
      confirmButtonLabel={submitText}
      confirmButtonAppearance={buttonColor}
      cancelButtonProps={{ appearance: "base", disabled: isSubmitting }}
      onConfirm={onConfirm}
      confirmButtonLoading={isSubmitting}
      renderInPortal
    >
      <p className={classes.summary}>{getInfoText()}:</p>
      <ul>
        {snapsToShow.map(({ snap }) => (
          <li key={snap.name}>{snap.name}</li>
        ))}
      </ul>
      <p className={classes.warning}>{getWarningText()}</p>
      {hasClassicSnaps && isChangeChannel ? (
        <p className={classes.warning}>{getChangeChannelModeText()}</p>
      ) : null}
    </ConfirmationModal>
  );
};

export default ConfirmSnapActionModal;
