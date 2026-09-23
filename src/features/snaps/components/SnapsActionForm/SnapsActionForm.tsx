import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { type FC, lazy, Suspense, useState } from "react";
import {
  getRequestAction,
  isConfirmableAction,
  hasNotification,
} from "./helpers";
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
    Record<string, { mode: SnapChangeMode; value: string }>
  >({});
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapAction, isSnapActionPending } = useSnapAction();

  const hasNoSelectedSnaps = selectedSnaps.length === 0;
  const isChangeChannel = action === "change channel";
  const needsConfirmation = isConfirmableAction(action);

  const snapsText = hasNoSelectedSnaps
    ? "snaps"
    : pluralize(selectedSnaps.length, ["snap"], "exact");

  const submitText = isChangeChannel
    ? `${capitalize(action)}`
    : `${capitalize(action)} ${snapsText}`;

  const onSubmit = async () => {
    try {
      await snapAction({
        action: getRequestAction(action),
        computer_ids: selectedInstances,
        snaps: selectedSnaps.map((item) => {
          if (!isChangeChannel) {
            return { name: item.snap.name };
          }

          const config = snapChangeConfigs[item.snap.id];
          const args =
            config?.mode === "revision"
              ? { revision: config.value }
              : { channel: config?.value };

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
      });
    } catch (error) {
      closeModal();
      debug(error);
    }
  };

  const hasMissingChangeValue =
    isChangeChannel &&
    selectedSnaps.some((item) => !snapChangeConfigs[item.snap.id]?.value);

  const getValidationError = () => {
    if (hasNoSelectedSnaps) {
      return "Select a snap to continue";
    }

    if (hasMissingChangeValue) {
      return "Select a channel or revision for each snap to continue";
    }

    return null;
  };

  const checkSubmit = () => {
    if (!getValidationError()) {
      if (needsConfirmation) {
        openModal();
      } else {
        onSubmit();
      }
    }
  };

  const handleSnapValueChange = (
    snapId: string,
    value: string,
    mode: SnapChangeMode,
  ) => {
    setSnapChangeConfigs((prev) => ({
      ...prev,
      [snapId]: { mode, value },
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

  const buttonAppearance = action === "uninstall" ? "negative" : "positive";

  return (
    <>
      <div className={classes.container}>
        {hasNotification(action) && (
          <Suspense fallback={<LoadingState />}>
            <SnapNotification action={action} />
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
                  <SnapChangeChannelItem
                    key={item.snap.id}
                    selectedSnap={item}
                    onDelete={handleDelete}
                    instanceIds={selectedInstances}
                    mode={config.mode}
                    value={config.value}
                    onChange={(value) => {
                      handleSnapValueChange(item.snap.id, value, config.mode);
                    }}
                    onModeChange={(mode) => {
                      handleSnapModeChange(item.snap.id, mode);
                    }}
                  />
                );
              }
              if (action === "install") {
                return (
                  <SnapAvailableItem
                    key={item.snap.id}
                    selectedSnap={item}
                    onDelete={handleDelete}
                  />
                );
              }
              return (
                <SnapInstalledItem
                  key={item.snap.id}
                  selectedSnap={item}
                  onDelete={handleDelete}
                  isUnhold={action === "unhold"}
                  instancesCount={selectedInstances.length}
                />
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

      {needsConfirmation && isModalOpen && (
        <Suspense fallback={<LoadingState />}>
          <ConfirmSnapActionModal
            actionVerb={action}
            snaps={selectedSnaps}
            instancesCount={selectedInstances.length}
            onClose={closeModal}
            onConfirm={onSubmit}
            isSubmitting={isSnapActionPending}
          />
        </Suspense>
      )}
    </>
  );
};

export default SnapsActionForm;
