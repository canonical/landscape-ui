import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { type FC, lazy, Suspense, useState } from "react";
import { getRequestAction, hasNotification } from "./helpers";
import { isValidRevision } from "../../helpers";
import { capitalize, pluralize } from "@/utils/_helpers";
import type {
  SnapAction,
  InstalledSnapWithCount,
  SnapChangeMode,
} from "../../types";
import classes from "./SnapsActionForm.module.scss";
import classNames from "classnames";
import SnapBulkSearch from "./components/SnapBulkSearch";
import SnapChangeChannelItem from "./components/SnapChangeChannelItem";
import SnapInstalledItem from "./components/SnapInstalledItem";
import SnapAvailableItem from "./components/SnapAvailableItem";
import { useSnapAction } from "../../api";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import useNotify from "@/hooks/useNotify";
import { useBoolean } from "usehooks-ts";
import LoadingState from "@/components/layout/LoadingState";
import { useOpenActivityDetailsPanel } from "@/features/activities";

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
  const [snapChangeConfigs, setSnapChangeConfigs] = useState<
    Record<
      string,
      {
        mode: SnapChangeMode;
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
  const isChangeChannel = action === "change channel";

  const snapsText = hasNoSelectedSnaps
    ? "snaps"
    : pluralize(selectedSnaps.length, ["snap"], "exact");

  const submitText = isChangeChannel
    ? `${capitalize(action)}`
    : `${capitalize(action)} ${snapsText}`;

  const onSubmit = async () => {
    try {
      const { data: activity } = await snapAction({
        action: getRequestAction(action),
        computer_ids: selectedInstances,
        snaps: selectedSnaps.map((item) => {
          if (!isChangeChannel) {
            return { name: item.snap.name };
          }

          const config = snapChangeConfigs[item.snap.id];
          const args =
            config?.mode === "revision"
              ? {
                  revision: config.value,
                  classic: item.confinement === "classic",
                }
              : {
                  channel: config?.channel,
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

  const hasMissingChangeValue =
    isChangeChannel &&
    selectedSnaps.some((item) => !snapChangeConfigs[item.snap.id]?.value);

  const hasInvalidRevisionValue =
    isChangeChannel &&
    selectedSnaps.some((item) => {
      const config = snapChangeConfigs[item.snap.id];

      return (
        config?.mode === "revision" &&
        !!config.value &&
        !isValidRevision(config.value)
      );
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
      !hasMissingChangeValue &&
      !hasInvalidRevisionValue
    ) {
      openModal();
    }
  };

  const handleSnapValueChange = (
    snapId: string,
    value: string,
    mode: SnapChangeMode,
    channel?: string,
    confinement?: string,
  ) => {
    setSnapChangeConfigs((prev) => ({
      ...prev,
      [snapId]: { mode, value, channel, confinement },
    }));
  };

  const handleSnapModeChange = (snapId: string, mode: SnapChangeMode) => {
    setSnapChangeConfigs((prev) => ({
      ...prev,
      [snapId]: { mode, value: "" },
    }));
  };

  const handleDeleteSnap = (snapId: string) => {
    setSelectedSnaps((snaps) => snaps.filter(({ snap }) => snap.id !== snapId));
    setSnapChangeConfigs((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => id !== snapId)),
    );
  };

  const changeModes = isChangeChannel
    ? Array.from(
        new Set(
          selectedSnaps.map(
            (item) => snapChangeConfigs[item.snap.id]?.mode ?? "channel",
          ),
        ),
      )
    : [];

  const buttonAppearance = action === "uninstall" ? "negative" : "positive";

  return (
    <>
      <div className={classes.container}>
        {hasNotification(action) && (
          <Suspense fallback={<LoadingState />}>
            <SnapNotification
              action={action}
              snapChangeConfigs={snapChangeConfigs}
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

              if (isChangeChannel) {
                const config = snapChangeConfigs[item.snap.id] ?? {
                  mode: "channel",
                  value: "",
                };

                return (
                  <li className={classes.selectedItem} key={item.snap.id}>
                    <SnapChangeChannelItem
                      selectedSnap={item}
                      onDelete={handleDelete}
                      instanceIds={selectedInstances}
                      mode={config.mode}
                      value={config.value}
                      hasAttemptedSubmit={hasAttemptedSubmit}
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
                  </li>
                );
              }
              if (action === "install") {
                return (
                  <li className={classes.selectedItem} key={item.snap.id}>
                    <SnapAvailableItem
                      selectedSnap={item}
                      onDelete={handleDelete}
                    />
                  </li>
                );
              }
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
            changeModes={changeModes}
            instancesCount={selectedInstances.length}
            onClose={closeModal}
            onConfirm={onSubmit}
            isSubmitting={isSnapActionPending}
            submitText={submitText}
          />
        </Suspense>
      )}
    </>
  );
};

export default SnapsActionForm;
