import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { type FC, useState } from "react";
import { getRequestAction, hasNotification } from "./helpers";
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
import SnapNotification from "./components/SnapNotification";
import ConfirmSnapActionModal from "./components/ConfirmSnapActionModal";

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
        title: `Snaps successfully queued to ${action}`,
        message: `You can track the progress in the Activities page.`,
      });
    } catch (error) {
      closeModal();
      debug(error);
    }
  };

  const checkSubmit = () => {
    if (hasNoSelectedSnaps) {
      return;
    }

    openModal();
  };

  const buttonAppearance = action === "uninstall" ? "negative" : "positive";

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
                  <li className={classes.selectedItem} key={item.snap.id}>
                    <SnapChangeChannelItem
                      selectedSnap={item}
                      onDelete={handleDelete}
                      instanceIds={selectedInstances}
                      onItemsUpdate={() => {
                        // Update selected snaps
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
        formError={
          hasNoSelectedSnaps && "You must add at least one snap to continue."
        }
      />

      {isModalOpen && (
        <ConfirmSnapActionModal
          actionVerb={action}
          snaps={selectedSnaps}
          instancesCount={selectedInstances.length}
          onClose={closeModal}
          onConfirm={onSubmit}
          isSubmitting={isSnapActionPending}
          submitText={submitText}
        />
      )}
    </>
  );
};

export default SnapsActionForm;
