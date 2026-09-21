import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { type FC, lazy, Suspense, useState } from "react";
import {
  getRequestAction,
  isConfirmableAction,
  hasNotification,
} from "./helpers";
import { capitalize, pluralize } from "@/utils/_helpers";
import type { SnapAction, InstalledSnapWithCount } from "../../types";
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
import LoadingState from "@/components/layout/SidePanel/LoadingState";

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
        snaps: selectedSnaps.map((item) => ({ name: item.snap.name })),
      });

      closeSidePanel();

      notify.success({
        title: `Snaps successfully set to ${action}`,
        message: `You can track the progress in the Activities page.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const checkSubmit = () => {
    if (hasNoSelectedSnaps) {
      return;
    }

    if (needsConfirmation) {
      openModal();
    } else {
      onSubmit();
    }
  };

  return (
    <>
      <div className={classes.container}>
        {hasNotification(action) && <SnapNotification action={action} />}
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
                setSelectedSnaps((snaps) =>
                  snaps.filter(({ snap }) => snap.id !== item.snap.id),
                );
              };

              if (isChangeChannel) {
                return (
                  <SnapChangeChannelItem
                    key={item.snap.id}
                    selectedSnap={item}
                    onDelete={handleDelete}
                    instanceIds={selectedInstances}
                    onItemsUpdate={() => {
                      // Update selected snaps
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
        submitButtonAppearance="positive"
        submitButtonLoading={isSnapActionPending}
        onSubmit={checkSubmit}
      />

      {needsConfirmation && isModalOpen && (
        <Suspense fallback={<LoadingState />}>
          <ConfirmSnapActionModal
            actionVerb={action}
            snaps={selectedSnaps}
            instancesCount={selectedInstances.length}
            onClose={closeModal}
            onConfirm={onSubmit}
          />
        </Suspense>
      )}
    </>
  );
};

export default SnapsActionForm;
