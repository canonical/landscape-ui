import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import type {
  ConfirmationModalProps,
  SubComponentProps,
} from "@canonical/react-components";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
  Tooltip,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { lazy, Suspense } from "react";
import { useMediaQuery } from "usehooks-ts";
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
  const isLargerScreen = useMediaQuery("(min-width: 620px)");
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const {
    removePocketQuery,
    syncMirrorPocketQuery,
    pullPackagesToPocketQuery,
  } = usePockets();
  const { mutateAsync: removePocket, isPending: isRemovingPocket } =
    removePocketQuery;

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

  const getPocketModal = (): SubComponentProps<ConfirmationModalProps> => {
    if ("mirror" === pocket.mode) {
      return {
        title: `Synchronizing ${pocket.name} pocket`,
        children: <p>Do you want to synchronize packages?</p>,
        confirmButtonLabel: "Sync",
        confirmButtonAppearance: "positive",
        confirmButtonDisabled: isSynchronizingMirrorPocket,
        confirmButtonLoading: isSynchronizingMirrorPocket,
        onConfirm: handleSyncPocket,
      };
    } else if ("pull" === pocket.mode) {
      return {
        title: `Pulling packages to ${pocket.name} pocket`,
        children: (
          <p>Do you want to pull packages from {pocket.pull_pocket}?</p>
        ),
        confirmButtonLabel: "Pull",
        confirmButtonAppearance: "positive",
        confirmButtonDisabled: isPullingPackagesToPocket,
        confirmButtonLoading: isPullingPackagesToPocket,
        onConfirm: handlePullPackagesToPocket,
      };
    }
    return {};
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

  return (
    <div className="divided-blocks">
      {"upload" != pocket.mode && (
        <div className="divided-blocks__item">
          <ConfirmationButton
            type="button"
            className={classNames("u-no-margin--bottom has-icon", {
              "u-no-padding--right": isLargerScreen,
              "is-small": isLargerScreen,
            })}
            appearance={isLargerScreen ? "base" : undefined}
            aria-label={
              "mirror" === pocket.mode
                ? `Synchronize ${pocket.name} pocket of ${distributionName}/${seriesName}`
                : `Pull packages to ${pocket.name} pocket of ${distributionName}/${seriesName}`
            }
            disabled={syncPocketRefs.some(
              (ref) => ref.distributionName === distributionName,
            )}
            confirmationModalProps={getPocketModal()}
          >
            <Tooltip
              position="btm-center"
              message={"mirror" === pocket.mode ? "Sync" : "Pull"}
            >
              <Icon
                name="change-version"
                className={classNames({
                  "u-no-margin--right": isLargerScreen,
                })}
              />
            </Tooltip>
          </ConfirmationButton>
        </div>
      )}
      <div className="divided-blocks__item">
        <Tooltip message="Edit" position="btm-center">
          <Button
            type="button"
            small={isLargerScreen}
            hasIcon
            appearance={isLargerScreen ? "base" : ""}
            className={classNames("u-no-margin--bottom", {
              "u-no-padding--right": isLargerScreen,
            })}
            aria-label={`Edit ${pocket.name} pocket of ${distributionName}/${seriesName}`}
            onClick={handleEditPocket}
            disabled={syncPocketRefs.some(
              (ref) => ref.distributionName === distributionName,
            )}
          >
            <Icon
              name="edit"
              className={classNames({
                "u-no-margin--right": isLargerScreen,
              })}
            />
          </Button>
        </Tooltip>
      </div>
      <div className="divided-blocks__item">
        <ConfirmationButton
          type="button"
          className={classNames("u-no-margin--bottom has-icon", {
            "u-no-padding--right": isLargerScreen,
            "is-small": isLargerScreen,
          })}
          appearance={isLargerScreen ? "base" : undefined}
          aria-label={`Remove ${pocket.name} pocket of ${distributionName}/${seriesName}`}
          disabled={syncPocketRefs.some(
            (ref) => ref.distributionName === distributionName,
          )}
          confirmationModalProps={{
            title: "Deleting pocket",
            children: (
              <p>
                Do you really want to delete {pocket.name} pocket from{" "}
                {seriesName} series of {distributionName} distribution?
              </p>
            ),
            confirmButtonLabel: "Delete",
            confirmButtonAppearance: "negative",
            confirmButtonDisabled: isRemovingPocket,
            confirmButtonLoading: isRemovingPocket,
            onConfirm: handleRemovePocket,
          }}
        >
          <Tooltip position="btm-center" message="Delete">
            <Icon
              name={ICONS.delete}
              className={classNames({
                "u-no-margin--right": isLargerScreen,
              })}
            />
          </Tooltip>
        </ConfirmationButton>
      </div>
    </div>
  );
};

export default SeriesPocketListActions;
