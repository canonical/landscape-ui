import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { type FC, lazy, Suspense, useCallback, useState } from "react";
import {
  getRequestAction,
  hasNotification,
  isRevisionNotificationAction,
} from "./helpers";
import { capitalize, pluralize } from "@/utils/_helpers";
import type { SnapAction, InstalledSnapWithCount, SnapMode } from "../../types";
import classes from "./SnapsActionForm.module.scss";
import classNames from "classnames";
import SnapBulkSearch from "./components/SnapBulkSearch";
import SnapInstalledItem from "./components/SnapInstalledItem";
import { useSnapAction } from "../../api";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import useNotify from "@/hooks/useNotify";
import { useBoolean } from "usehooks-ts";
import LoadingState from "@/components/layout/LoadingState";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import { isValidRevision } from "../../helpers";
import SnapItemTitleRow from "./components/SnapItemTitleRow";
import SnapItemSubtitle from "./components/SnapItemSubtitle";
import SnapChannelRevisionFields from "../SnapChannelRevisionFields";
import { Notification } from "@canonical/react-components";

const ConfirmSnapActionModal = lazy(
  () => import("./components/ConfirmSnapActionModal"),
);
const SnapNotification = lazy(() => import("./components/SnapNotification"));

interface SnapsActionFormProps {
  readonly selectedInstances: number[];
  readonly action: SnapAction;
}

const SnapsActionForm: FC<SnapsActionFormProps> = ({
  selectedInstances,
  action,
}) => {
  const [selectedSnaps, setSelectedSnaps] = useState<InstalledSnapWithCount[]>(
    [],
  );
  const [loadingSnapIds, setLoadingSnapIds] = useState<Record<string, boolean>>(
    {},
  );
  const [errorSnapIds, setErrorSnapIds] = useState<Record<string, boolean>>({});
  const [snapModeConfigs, setSnapModeConfigs] = useState<
    Record<
      string,
      {
        mode: SnapMode;
        value: string;
        channel?: string;
        confinement?: string;
      }
    >
  >({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { closeSidePanel } = useSidePanel();
  const { snapAction, isSnapActionPending } = useSnapAction();

  const hasNoSelectedSnaps = selectedSnaps.length === 0;

  const snapsText = hasNoSelectedSnaps
    ? "snaps"
    : pluralize(selectedSnaps.length, ["snap"], "exact");

  const submitText =
    action === "change channel"
      ? `${capitalize(action)}`
      : `${capitalize(action)} ${snapsText}`;

  const onSubmit = async () => {
    try {
      const { data: activity } = await snapAction({
        action: getRequestAction(action),
        computer_ids: selectedInstances,
        snaps: selectedSnaps.map((item) => {
          if (action !== "change channel" && action !== "install") {
            return { name: item.snap.name };
          }

          const config = snapModeConfigs[item.snap.id];
          const channel = config?.channel?.trim() || undefined;
          const args =
            config?.mode === "revision"
              ? {
                  revision: config.value,
                  classic: item.confinement === "classic",
                }
              : {
                  ...(channel ? { channel } : {}),
                  classic: config?.confinement === "classic",
                };

          return {
            name: item.snap.name,
            args,
          };
        }),
      });

      closeSidePanel();

      notify.success({
        title: `Snaps successfully queued to ${action}`,
        message: `You can track the progress in the Activities page.`,
        actions: [
          {
            label: "View details",
            onClick: () => {
              openActivityDetails(activity);
            },
          },
        ],
      });
    } catch (error) {
      closeModal();
      debug(error);
    }
  };

  const hasMissingRevisionValue = selectedSnaps.some((item) => {
    const config = snapModeConfigs[item.snap.id];

    return config?.mode === "revision" && !config.value;
  });

  const hasInvalidRevisionValue = selectedSnaps.some((item) => {
    const config = snapModeConfigs[item.snap.id];

    return (
      config?.mode === "revision" &&
      !!config.value &&
      !isValidRevision(config.value)
    );
  });

  const isAnySnapInfoLoading = selectedSnaps.some(
    (item) => loadingSnapIds[item.snap.id],
  );

  const hasSnapInfoError = selectedSnaps.some((item) => {
    const mode = snapModeConfigs[item.snap.id]?.mode ?? "channel";
    return mode === "channel" && errorSnapIds[item.snap.id];
  });

  const getValidationError = () => {
    if (hasNoSelectedSnaps) {
      return "You must add at least one snap to continue";
    }

    return null;
  };

  const checkSubmit = () => {
    setHasAttemptedSubmit(true);
    if (
      !getValidationError() &&
      !isAnySnapInfoLoading &&
      !hasSnapInfoError &&
      !hasMissingRevisionValue &&
      !hasInvalidRevisionValue
    ) {
      openModal();
    }
  };

  const handleSnapLoadingChange = useCallback(
    (snapId: string, isLoading: boolean) => {
      setLoadingSnapIds((prev) =>
        prev[snapId] === isLoading ? prev : { ...prev, [snapId]: isLoading },
      );
    },
    [],
  );

  const handleSnapErrorChange = useCallback(
    (snapId: string, isError: boolean) => {
      setErrorSnapIds((prev) =>
        prev[snapId] === isError ? prev : { ...prev, [snapId]: isError },
      );
    },
    [],
  );

  const handleSnapValueChange = (
    snapId: string,
    value: string,
    mode: SnapMode,
    channel?: string,
    confinement?: string,
  ) => {
    setSnapModeConfigs((prev) => ({
      ...prev,
      [snapId]: { mode, value, channel, confinement },
    }));
  };

  const handleSnapModeChange = (snapId: string, mode: SnapMode) => {
    setSnapModeConfigs((prev) => ({
      ...prev,
      [snapId]: { mode, value: "", confinement: prev[snapId]?.confinement },
    }));
  };

  const handleDeleteSnap = (snapId: string) => {
    setSelectedSnaps((snaps) => snaps.filter(({ snap }) => snap.id !== snapId));
    setSnapModeConfigs((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => id !== snapId)),
    );
    setLoadingSnapIds((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => id !== snapId)),
    );
    setErrorSnapIds((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => id !== snapId)),
    );
  };

  const snapModes = ["change channel", "install"].includes(action)
    ? Array.from(
        new Set(
          selectedSnaps.map(
            (item) => snapModeConfigs[item.snap.id]?.mode ?? "channel",
          ),
        ),
      )
    : [];

  const buttonAppearance = action === "uninstall" ? "negative" : "positive";

  return (
    <>
      <div className={classes.container}>
        {(hasNotification(action) || isRevisionNotificationAction(action)) && (
          <Suspense fallback={<LoadingState />}>
            <SnapNotification
              action={action}
              snapModeConfigs={snapModeConfigs}
            />
          </Suspense>
        )}
        <SnapBulkSearch
          instanceIds={selectedInstances}
          selectedItems={selectedSnaps}
          setSelectedItems={setSelectedSnaps}
          action={action}
        />

        <div className={classNames("p-text--small-caps", classes.header)}>
          Snaps to {action}
        </div>

        {hasNoSelectedSnaps ? (
          <div>No snaps have been added yet.</div>
        ) : (
          <ul className="p-list u-no-margin--bottom">
            {selectedSnaps.map((item) => {
              const handleDelete = () => {
                handleDeleteSnap(item.snap.id);
              };

              const config = snapModeConfigs[item.snap.id] ?? {
                mode: "channel",
                value: "",
              };

              const channelRevisionFields = (
                <SnapChannelRevisionFields
                  instanceIds={selectedInstances}
                  selectedSnap={item}
                  mode={config.mode}
                  value={config.value}
                  hasAttemptedSubmit={hasAttemptedSubmit}
                  onLoadingChange={(isLoading) => {
                    handleSnapLoadingChange(item.snap.id, isLoading);
                  }}
                  onErrorChange={(isError) => {
                    handleSnapErrorChange(item.snap.id, isError);
                  }}
                  onChange={(value, channel, confinement) => {
                    handleSnapValueChange(
                      item.snap.id,
                      value,
                      config.mode,
                      channel,
                      confinement,
                    );
                  }}
                  onModeChange={(mode) => {
                    handleSnapModeChange(item.snap.id, mode);
                  }}
                />
              );

              switch (action) {
                case "change channel": {
                  return (
                    <li className={classes.selectedItem} key={item.snap.id}>
                      <SnapItemTitleRow
                        name={item.snap.name}
                        onDelete={handleDelete}
                      />
                      <SnapItemSubtitle
                        scope="Installed"
                        computerCount={item.computerCount}
                      />
                      <div className={classes.changeToLabel}>Change to</div>
                      {channelRevisionFields}
                    </li>
                  );
                }
                case "install": {
                  return (
                    <li className={classes.selectedItem} key={item.snap.id}>
                      <SnapItemTitleRow
                        name={item.snap.name}
                        onDelete={handleDelete}
                      />
                      {channelRevisionFields}
                      {config.confinement === "classic" ? (
                        <Notification
                          severity="caution"
                          className={classNames(
                            classes.classicNotification,
                            "u-no-margin--bottom",
                          )}
                        >
                          This snap requires classic confinement
                        </Notification>
                      ) : null}
                    </li>
                  );
                }
                default: {
                  return (
                    <li className={classes.selectedItem} key={item.snap.id}>
                      <SnapInstalledItem
                        selectedSnap={item}
                        onDelete={handleDelete}
                        isUnhold={action === "unhold"}
                        instancesCount={selectedInstances.length}
                      />
                    </li>
                  );
                }
              }
            })}
          </ul>
        )}
      </div>

      <SidePanelFormButtons
        submitButtonText={submitText}
        submitButtonAppearance={buttonAppearance}
        submitButtonLoading={isSnapActionPending}
        onSubmit={checkSubmit}
        formError={getValidationError()}
      />

      {isModalOpen && (
        <Suspense fallback={<LoadingState />}>
          <ConfirmSnapActionModal
            actionVerb={action}
            snaps={selectedSnaps}
            snapModes={snapModes}
            instancesCount={selectedInstances.length}
            onClose={closeModal}
            onConfirm={onSubmit}
            isSubmitting={isSnapActionPending}
            submitText={submitText}
            snapModeConfigs={snapModeConfigs}
          />
        </Suspense>
      )}
    </>
  );
};

export default SnapsActionForm;
