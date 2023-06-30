import { Series } from "../../../../types/Series";
import { FC } from "react";
import { Button, MainTable } from "@canonical/react-components";
import { Pocket } from "../../../../types/Pocket";
import { Distribution } from "../../../../types/Distribution";
import usePockets from "../../../../hooks/usePockets";
import useDebug from "../../../../hooks/useDebug";
import useConfirm from "../../../../hooks/useConfirm";
import useSidePanel from "../../../../hooks/useSidePanel";
import EditPocketForm from "./EditPocketForm";
import classNames from "classnames";
import PackageList from "./PackageList";
import classes from "./SeriesPocketList.module.scss";

interface SeriesPocketListProps {
  distributionName: Distribution["name"];
  series: Series;
}

const SeriesPocketList: FC<SeriesPocketListProps> = ({
  distributionName,
  series,
}) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const {
    removePocketQuery,
    syncMirrorPocketQuery,
    pullPackagesToPocketQuery,
  } = usePockets();
  const {
    mutate: removePocket,
    isLoading: isRemovingPocket,
    error: removePocketError,
  } = removePocketQuery;

  if (removePocketError) {
    debug(removePocketError);
  }

  const handleRemovePocket = (pocket: Pocket) => {
    confirmModal({
      body: `Do you really want to delete ${pocket.name} pocket from ${series.name} series of ${distributionName} distribution?`,
      title: "Deleting pocket",
      buttons: [
        <Button
          key={`delete-${pocket.name}-pocket`}
          appearance="negative"
          disabled={isRemovingPocket}
          onClick={() => {
            removePocket({
              distribution: distributionName,
              series: series.name,
              name: pocket.name,
            });

            closeConfirmModal();
          }}
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

  const handleSyncPocket = (pocket: Pocket) => {
    if ("mirror" === pocket.mode) {
      confirmModal({
        title: `Synchronizing ${pocket.name} pocket`,
        body: "Do you want to synchronize packages?",
        buttons: [
          <Button
            key={pocket.name}
            appearance="positive"
            onClick={async () => {
              try {
                await syncMirrorPocket({
                  name: pocket.name,
                  series: series.name,
                  distribution: distributionName,
                });

                closeConfirmModal();
              } catch (error) {
                debug(error);
              }
            }}
            disabled={isSynchronizingMirrorPocket}
          >
            Sync
          </Button>,
        ],
      });
    } else if ("pull" === pocket.mode) {
      confirmModal({
        title: `Pulling packages to ${pocket.name} pocket`,
        body: `Do you want to pull packages from ${pocket.pull_pocket}`,
        buttons: [
          <Button
            key={pocket.name}
            appearance="positive"
            onClick={async () => {
              try {
                await pullPackagesToPocket({
                  name: pocket.name,
                  series: series.name,
                  distribution: distributionName,
                });

                closeConfirmModal();
              } catch (error) {
                debug(error);
              }
            }}
            disabled={isPullingPackagesToPocket}
          >
            Pull
          </Button>,
        ],
      });
    }
  };

  const handleEditPocket = (pocket: Pocket) => {
    setSidePanelOpen(true);
    setSidePanelContent(
      `Edit ${pocket.name} pocket`,
      <EditPocketForm
        pocket={pocket}
        distributionName={distributionName}
        seriesName={series.name}
      />
    );
  };

  const handleListPocket = (pocket: Pocket) => {
    setSidePanelOpen(true);
    setSidePanelContent(
      `${series.name} ${pocket.name}`,
      <PackageList
        pocket={pocket}
        distributionName={distributionName}
        seriesName={series.name}
      />
    );
  };

  const headers = [
    { content: "Pocket" },
    { content: "Mode" },
    { content: "Last synced" },
    { content: "Content" },
    {},
  ];

  const rows = series.pockets.map((pocket) => {
    return {
      columns: [
        {
          content:
            "pull" !== pocket.mode ? (
              <Button
                appearance="link"
                className="u-no-margin--bottom u-no-padding--top"
                onClick={() => {
                  handleListPocket(pocket);
                }}
              >
                {pocket.name}
              </Button>
            ) : (
              <>
                <div>
                  <Button
                    appearance="link"
                    className="u-no-margin--bottom u-no-padding--top"
                    onClick={() => {
                      handleListPocket(pocket);
                    }}
                  >
                    {pocket.name}
                  </Button>
                </div>
                <div
                  className={classNames(
                    "p-text--small u-text--muted u-no-margin--bottom"
                  )}
                >{`pulling from ${pocket.pull_pocket}`}</div>
              </>
            ),
          role: "rowheader",
          "aria-label": "Pocket",
        },
        {
          content: pocket.mode,
          "aria-label": "Mode",
        },
        {
          content: "",
          "aria-label": "Last synced date",
        },
        {
          content: "",
          "aria-label": "Content",
        },
        {
          className: "u-align--right",
          "aria-label": "Actions",
          content: (
            <>
              {"upload" !== pocket.mode && (
                <Button
                  small
                  hasIcon
                  appearance="base"
                  className="u-no-margin--bottom u-no-padding--right p-tooltip--btm-center"
                  aria-label={`${
                    "mirror" === pocket.mode ? "Synchronize" : "Pull"
                  } ${pocket.name} pocket`}
                  onClick={() => {
                    handleSyncPocket(pocket);
                  }}
                >
                  <i className="p-icon--change-version" />
                  <span className="p-tooltip__message">
                    {"mirror" === pocket.mode ? "Sync" : "Pull"}
                  </span>
                </Button>
              )}
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--right p-tooltip--btm-center"
                aria-label={`Edit ${pocket.name} pocket`}
                onClick={() => {
                  handleEditPocket(pocket);
                }}
              >
                <i className="p-icon--edit" />
                <span className="p-tooltip__message">Edit</span>
              </Button>
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--right p-tooltip--btm-center"
                aria-label={`Remove ${pocket.name} pocket`}
                onClick={() => {
                  handleRemovePocket(pocket);
                }}
              >
                <i className="p-icon--delete" />
                <span className="p-tooltip__message">Delete</span>
              </Button>
            </>
          ),
        },
      ],
    };
  });

  return (
    <MainTable
      className={classes.content}
      headers={headers}
      rows={rows}
      emptyStateMsg="No pockets yet"
    />
  );
};

export default SeriesPocketList;
