import classNames from "classnames";
import { FC, lazy, MouseEvent as ReactMouseEvent, Suspense } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Button, Tooltip } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import usePockets from "@/hooks/usePockets";
import useSidePanel from "@/hooks/useSidePanel";
import { SyncPocketRef } from "@/pages/dashboard/repositories/mirrors/types";
import { Pocket } from "@/types/Pocket";

const EditPocketForm = lazy(
  () => import("@/pages/dashboard/repositories/mirrors/EditPocketForm"),
);

interface SeriesPocketListActionsProps {
  distributionName: string;
  pocket: Pocket;
  seriesName: string;
  syncPocketRefs: SyncPocketRef[];
}

const SeriesPocketListActions: FC<SeriesPocketListActionsProps> = ({
  distributionName,
  pocket,
  seriesName,
  syncPocketRefs,
}) => {
  const isLargerScreen = useMediaQuery("(min-width: 620px)");
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelContent } = useSidePanel();
  const {
    removePocketQuery,
    syncMirrorPocketQuery,
    pullPackagesToPocketQuery,
  } = usePockets();
  const { mutateAsync: removePocket, isLoading: isRemovingPocket } =
    removePocketQuery;

  const handleRemovePocket = (pocket: Pocket) => {
    confirmModal({
      body: `Do you really want to delete ${pocket.name} pocket from ${seriesName} series of ${distributionName} distribution?`,
      title: "Deleting pocket",
      buttons: [
        <Button
          key={`delete-${pocket.name}-pocket`}
          appearance="negative"
          disabled={isRemovingPocket}
          onClick={async () => {
            try {
              await removePocket({
                distribution: distributionName,
                series: seriesName,
                name: pocket.name,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
          aria-label={`Delete ${pocket.name} pocket of ${distributionName}/${seriesName}`}
        >
          Delete
        </Button>,
      ],
    });
  };

  const {
    mutateAsync: syncMirrorPocket,
    isLoading: isSynchronizingMirrorPocket,
  } = syncMirrorPocketQuery;
  const {
    mutateAsync: pullPackagesToPocket,
    isLoading: isPullingPackagesToPocket,
  } = pullPackagesToPocketQuery;

  const handleSyncPocket = async () => {
    try {
      await syncMirrorPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handlePullPackagesToPocket = async () => {
    try {
      await pullPackagesToPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleSyncPocketDialog = (pocket: Pocket) => {
    if ("mirror" === pocket.mode) {
      confirmModal({
        title: `Synchronizing ${pocket.name} pocket`,
        body: "Do you want to synchronize packages?",
        buttons: [
          <Button
            key={pocket.name}
            appearance="positive"
            onClick={handleSyncPocket}
            disabled={isSynchronizingMirrorPocket}
            aria-label={`Synchronize ${pocket.name} pocket of ${distributionName}/${seriesName}`}
          >
            Sync
          </Button>,
        ],
      });
    } else if ("pull" === pocket.mode) {
      confirmModal({
        title: `Pulling packages to ${pocket.name} pocket`,
        body: `Do you want to pull packages from ${pocket.pull_pocket}?`,
        buttons: [
          <Button
            key={pocket.name}
            appearance="positive"
            onClick={handlePullPackagesToPocket}
            disabled={isPullingPackagesToPocket}
            aria-label={`Pull packages to ${pocket.name} pocket of ${distributionName}/${seriesName}`}
          >
            Pull
          </Button>,
        ],
      });
    }
  };

  const handleEditPocket = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    pocket: Pocket,
  ) => {
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

  return (
    <div className="divided-blocks">
      {("mirror" == pocket.mode || "pull" == pocket.mode) && (
        <div className="divided-blocks__item">
          <Tooltip
            message={"mirror" === pocket.mode ? "Sync" : "Pull"}
            position="btm-center"
          >
            <Button
              small={isLargerScreen}
              hasIcon
              appearance={isLargerScreen ? "base" : ""}
              className={classNames("u-no-margin--bottom", {
                "u-no-padding--right": isLargerScreen,
              })}
              aria-label={
                "mirror" === pocket.mode
                  ? `Synchronize ${pocket.name} pocket of ${distributionName}/${seriesName}`
                  : `Pull packages to ${pocket.name} pocket of ${distributionName}/${seriesName}`
              }
              onClick={() => handleSyncPocketDialog(pocket)}
              disabled={syncPocketRefs.some(
                (ref) => ref.distributionName === distributionName,
              )}
            >
              <i
                className={classNames("p-icon--change-version", {
                  "u-no-margin--right": isLargerScreen,
                })}
              />
            </Button>
          </Tooltip>
        </div>
      )}
      <div className="divided-blocks__item">
        <Tooltip message="Edit" position="btm-center">
          <Button
            small={isLargerScreen}
            hasIcon
            appearance={isLargerScreen ? "base" : ""}
            className={classNames("u-no-margin--bottom", {
              "u-no-padding--right": isLargerScreen,
            })}
            aria-label={`Edit ${pocket.name} pocket of ${distributionName}/${seriesName}`}
            onClick={(event) => handleEditPocket(event, pocket)}
            disabled={syncPocketRefs.some(
              (ref) => ref.distributionName === distributionName,
            )}
          >
            <i
              className={classNames("p-icon--edit", {
                "u-no-margin--right": isLargerScreen,
              })}
            />
          </Button>
        </Tooltip>
      </div>
      <div className="divided-blocks__item">
        <Tooltip message="Delete" position="btm-center">
          <Button
            small={isLargerScreen}
            hasIcon
            appearance={isLargerScreen ? "base" : ""}
            className={classNames("u-no-margin--bottom", {
              "u-no-padding--right": isLargerScreen,
            })}
            aria-label={`Remove ${pocket.name} pocket of ${distributionName}/${seriesName}`}
            onClick={() => handleRemovePocket(pocket)}
            disabled={syncPocketRefs.some(
              (ref) => ref.distributionName === distributionName,
            )}
          >
            <i
              className={classNames("p-icon--delete", {
                "u-no-margin--right": isLargerScreen,
              })}
            />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default SeriesPocketListActions;
