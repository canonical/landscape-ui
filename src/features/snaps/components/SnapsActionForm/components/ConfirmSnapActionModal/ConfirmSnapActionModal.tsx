import type {
  SnapAction,
  SnapMode,
  SnapModeConfig,
  SnapWithCount,
} from "../../../../types";
import { capitalize, pluralize } from "@/utils/_helpers";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./ConfirmSnapActionModal.module.scss";
import { getChangeChannelVerb } from "../../helpers";

interface ConfirmSnapActionModalProps {
  readonly actionVerb: SnapAction;
  readonly snapModes?: SnapMode[];
  readonly snaps: SnapWithCount[];
  readonly instancesCount: number;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly isSubmitting: boolean;
  readonly submitText: string;
  readonly snapModeConfigs?: Record<string, SnapModeConfig>;
}

const ConfirmSnapActionModal: FC<ConfirmSnapActionModalProps> = ({
  actionVerb,
  snaps,
  snapModes = [],
  instancesCount,
  onClose,
  onConfirm,
  isSubmitting,
  submitText,
  snapModeConfigs = {},
}) => {
  const hasChannelMode = snapModes.includes("channel");
  const hasRevisionMode = snapModes.includes("revision");
  const isMixedChangeMode = hasChannelMode && hasRevisionMode;
  const changeChannelVerb = getChangeChannelVerb(snapModes);

  // confinement is "classic" either because the channel-map data forces it
  // (selected channel requires classic on some architecture) or because the
  // user opted in via a checkbox (revision mode, or default-channel case)
  const isClassic = (snap: SnapWithCount) =>
    snapModeConfigs[snap.snap.id]?.confinement === "classic";

  const classicSnaps = snaps.filter(isClassic);

  // Whenever any selected snap requires classic confinement, that takes
  // over the title, summary list, and info text regardless of action
  // (install, change channel, etc.), since it is the dominant concern for
  // the user to confirm. Change channel additionally keeps its
  // mode-specific guidance (revision vs. channel tracking behavior) below
  // the classic-confinement warning.
  const hasClassicSnaps = classicSnaps.length > 0;

  const snapsToShow = hasClassicSnaps ? classicSnaps : snaps;

  const pluralizeBySnaps = (singular: string, plural: string) =>
    pluralize(snaps.length, [singular, plural]);

  // Restate what was chosen for each snap so the user can verify the
  // revision or channel before queueing the activity.
  const getSnapDetail = (snap: SnapWithCount) => {
    const config = snapModeConfigs[snap.snap.id];

    if (config?.mode === "revision" && config.value) {
      return `revision ${config.value}`;
    }
    if (config?.mode === "channel") {
      // an empty channel means no channels were found, so the snap
      // installs from its default channel
      if (!config.channel) {
        return "default";
      }
      return config.channel;
    }
    return undefined;
  };

  const getTitle = () => {
    const snapsText = pluralize(snaps.length, ["snap"], "exact");

    if (hasClassicSnaps) {
      return `${pluralize(
        snapsToShow.length,
        [`of ${snapsText} requires`, `of ${snapsText} require`],
        "exact",
      )} classic confinement`;
    }

    const instancesText = pluralize(instancesCount, ["instance"], "exact");

    switch (actionVerb) {
      case "uninstall":
        return `Uninstall ${snapsText} from ${instancesText}`;
      case "change channel":
        return `${capitalize(changeChannelVerb)} of ${snapsText} on ${instancesText}`;
      default:
        return `${capitalize(actionVerb)} ${snapsText} on ${instancesText}`;
    }
  };

  const getInfoText = () => {
    const snapWord = pluralize(snapsToShow.length, ["snap"]);

    if (hasClassicSnaps) {
      const requireWord = pluralize(snapsToShow.length, [
        "requires",
        "require",
      ]);
      return `The following ${snapWord} you selected ${requireWord} classic confinement`;
    }

    const hasWord = pluralize(snapsToShow.length, ["has", "have"]);
    return `The following ${snapWord} ${hasWord} been selected to ${actionVerb === "change channel" ? changeChannelVerb : actionVerb}`;
  };

  const getChangeChannelModeText = () => {
    if (isMixedChangeMode) {
      return "Snaps set to a channel will update to that channel's latest revision. Snaps set to a specific revision will keep tracking their current channel, so a future refresh may replace it with that channel's latest revision.";
    }
    if (hasRevisionMode) {
      return pluralizeBySnaps(
        "Installing the specified revision will not change the snap's tracked channel, so a future refresh may replace it with that channel's latest revision.",
        "Installing the specified revisions will not change the snaps' tracked channels, so a future refresh may replace them with those channels' latest revisions.",
      );
    }
    return pluralizeBySnaps(
      "Changing the channel will update the snap to the latest revision on the new channel.",
      "Changing the channels will update the snaps to the latest revision on their new channels.",
    );
  };

  const getInstallModeText = () => {
    if (isMixedChangeMode) {
      return (
        <>
          Snaps set to a channel will install that channel&apos;s latest
          revision. Snaps set to a specific revision will track{" "}
          <code>latest/stable</code>, so a future refresh may replace it with
          that channel&apos;s latest revision.
        </>
      );
    }
    if (hasRevisionMode) {
      return (
        <>
          {pluralizeBySnaps("The installed snap", "Installed snaps")} will track{" "}
          <code>latest/stable</code>, so a future refresh may replace{" "}
          {pluralizeBySnaps("it", "them")} with that channel&apos;s latest
          revision.
        </>
      );
    }
    return pluralizeBySnaps(
      "Installing the snap will set it to the latest revision on the specified channel.",
      "Installing the snaps will set them to the latest revision on the specified channels.",
    );
  };

  const getClassicWarningText = () => {
    return (
      <>
        <strong>
          By proceeding, you acknowledge that{" "}
          {pluralize(classicSnaps.length, ["it", "they"])} may have access to
          your files and system.
        </strong>{" "}
        Only use classic confinement if you trust the publisher.
      </>
    );
  };

  const getWarningText = () => {
    switch (actionVerb) {
      case "refresh":
        return `Landscape will check each of the selected instances for a newer revision on the channel ${pluralizeBySnaps("that snap", "each snap")} is currently tracking, and install it where one is found.`;
      case "uninstall":
        return (
          <strong>
            {pluralizeBySnaps("It", "They")} will be queued to uninstall from
            all relevant instances.
          </strong>
        );
      case "hold":
        return `Landscape will hold all refreshes from the moment the client executes the activity. ${pluralizeBySnaps(
          "If the snap was already held, Landscape will replace the existing hold with an indefinite one.",
          "If any of the snaps were already held, Landscape will replace the existing holds with indefinite ones.",
        )}`;
      case "install":
        return getInstallModeText();
      case "unhold":
        return pluralizeBySnaps(
          "Each refresh will now update the snap to the latest revision on the current channel.",
          "Each refresh will now update the snaps to the latest revision on their current channels.",
        );
      case "change channel":
        return getChangeChannelModeText();
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
        {snapsToShow.map((snapWithCount) => {
          const { name } = snapWithCount.snap;
          const detail = getSnapDetail(snapWithCount);

          return (
            <li key={name}>
              <span>{name}</span>
              {detail ? (
                <span className="u-text--muted"> ({detail})</span>
              ) : null}
            </li>
          );
        })}
      </ul>
      {hasClassicSnaps ? (
        <p className={classes.warning}>{getClassicWarningText()}</p>
      ) : null}
      <p className={classes.warning}>{getWarningText()}</p>
    </ConfirmationModal>
  );
};

export default ConfirmSnapActionModal;
