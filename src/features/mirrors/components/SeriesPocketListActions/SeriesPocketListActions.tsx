import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { usePockets } from "../../hooks";
import type { Pocket, SyncPocketRef } from "../../types";

const EditPocketForm = lazy(async () => import("../EditPocketForm"));

interface SeriesPocketListActionsProps {
  readonly distributionName: string;
  readonly pocket: Pocket;
  readonly seriesName: string;
  readonly syncPocketRefs: SyncPocketRef[];
}

const SeriesPocketListActions: FC<SeriesPocketListActionsProps> = ({
  distributionName,
  pocket,
  seriesName,
  syncPocketRefs,
}) => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const {
    removePocketQuery,
    syncMirrorPocketQuery,
    pullPackagesToPocketQuery,
  } = usePockets();
  const { mutateAsync: removePocket, isPending: isRemovingPocket } =
    removePocketQuery;

  const {
    value: isSyncModalOpen,
    setTrue: openSyncModal,
    setFalse: closeSyncModal,
  } = useBoolean();

  const {
    value: isPullModalOpen,
    setTrue: openPullModal,
    setFalse: closePullModal,
  } = useBoolean();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleRemovePocket = async (): Promise<void> => {
    try {
      await removePocket({
        distribution: distributionName,
        series: seriesName,
        name: pocket.name,
      });
    } catch (error) {
      debug(error);
    }
  };

  const {
    mutateAsync: syncMirrorPocket,
    isPending: isSynchronizingMirrorPocket,
  } = syncMirrorPocketQuery;
  const {
    mutateAsync: pullPackagesToPocket,
    isPending: isPullingPackagesToPocket,
  } = pullPackagesToPocketQuery;

  const handleSyncPocket = async (): Promise<void> => {
    try {
      await syncMirrorPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handlePullPackagesToPocket = async (): Promise<void> => {
    try {
      await pullPackagesToPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleEditPocket = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    event.currentTarget.blur();

    setSidePanelContent(
      `Edit ${pocket.name} pocket`,
      <Suspense fallback={<LoadingState />}>
        <EditPocketForm
          pocket={pocket}
          distributionName={distributionName}
          seriesName={seriesName}
        />
      </Suspense>,
    );
  };

  const disabled = syncPocketRefs.some(
    (ref) => ref.distributionName === distributionName,
  );

  const actions = [];

  switch (pocket.mode) {
    case "mirror": {
      actions.push({
        icon: "change-version",
        label: "Sync",
        "aria-label": `Synchronize ${pocket.name} pocket of ${distributionName}/${seriesName}`,
        onClick: openSyncModal,
        disabled,
      });

      break;
    }

    case "pull": {
      actions.push({
        icon: "change-version",
        label: "Pull",
        "aria-label": `Pull packages to ${pocket.name} pocket of ${distributionName}/${seriesName}`,
        onClick: openPullModal,
        disabled,
      });

      break;
    }
  }

  actions.push({
    icon: "edit",
    label: "Edit",
    "aria-label": `Edit ${pocket.name} pocket of ${distributionName}/${seriesName}`,
    onClick: handleEditPocket,
    disabled,
  });

  const destructiveActions = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${pocket.name} pocket of ${distributionName}/${seriesName}`,
      onClick: openRemoveModal,
      disabled,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${pocket.name} pocket of ${distributionName}/${seriesName} actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      {pocket.mode === "mirror" && isSyncModalOpen && (
        <ConfirmationModal
          title={`Synchronizing ${pocket.name} pocket`}
          confirmButtonLabel="Sync"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isSynchronizingMirrorPocket}
          confirmButtonLoading={isSynchronizingMirrorPocket}
          onConfirm={async () => {
            await handleSyncPocket();
            closeSyncModal();
          }}
          close={closeSyncModal}
        >
          <p>Do you want to synchronize packages?</p>
        </ConfirmationModal>
      )}

      {pocket.mode === "pull" && isPullModalOpen && (
        <ConfirmationModal
          title={`Pulling packages to ${pocket.name} pocket`}
          confirmButtonLabel="Pull"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isPullingPackagesToPocket}
          confirmButtonLoading={isPullingPackagesToPocket}
          onConfirm={async () => {
            await handlePullPackagesToPocket();
            closePullModal();
          }}
          close={closePullModal}
        >
          <p>Do you want to pull packages from {pocket.pull_pocket}?</p>
        </ConfirmationModal>
      )}

      {isRemoveModalOpen && (
        <ConfirmationModal
          title="Deleting pocket"
          confirmButtonLabel="Delete"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemovingPocket}
          confirmButtonLoading={isRemovingPocket}
          onConfirm={async () => {
            await handleRemovePocket();
            closeRemoveModal();
          }}
          close={closeRemoveModal}
        >
          <p>
            Do you really want to delete {pocket.name} pocket from {seriesName}{" "}
            series of {distributionName} distribution?
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default SeriesPocketListActions;
