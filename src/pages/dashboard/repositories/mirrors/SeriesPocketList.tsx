import { Series } from "../../../../types/Series";
import { FC } from "react";
import { Button, Col, MainTable, Row } from "@canonical/react-components";
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
import { useMediaQuery } from "usehooks-ts";
import InfoItem from "../../../../components/layout/InfoItem";

interface SeriesPocketListProps {
  distributionName: Distribution["name"];
  series: Series;
}

const SeriesPocketList: FC<SeriesPocketListProps> = ({
  distributionName,
  series,
}) => {
  const isSmall = useMediaQuery("(min-width: 620px)");

  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const {
    removePocketQuery,
    syncMirrorPocketQuery,
    pullPackagesToPocketQuery,
  } = usePockets();
  const { mutateAsync: removePocket, isLoading: isRemovingPocket } =
    removePocketQuery;

  const handleRemovePocket = (pocket: Pocket) => {
    confirmModal({
      body: `Do you really want to delete ${pocket.name} pocket from ${series.name} series of ${distributionName} distribution?`,
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
                series: series.name,
                name: pocket.name,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
          aria-label={`Delete ${pocket.name} pocket of ${distributionName}/${series.name}`}
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
              } catch (error) {
                debug(error);
              } finally {
                closeConfirmModal();
              }
            }}
            disabled={isSynchronizingMirrorPocket}
            aria-label={`Synchronize ${pocket.name} pocket of ${distributionName}/${series.name}`}
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
            onClick={async () => {
              try {
                await pullPackagesToPocket({
                  name: pocket.name,
                  series: series.name,
                  distribution: distributionName,
                });
              } catch (error) {
                debug(error);
              } finally {
                closeConfirmModal();
              }
            }}
            disabled={isPullingPackagesToPocket}
            aria-label={`Pull packages to ${pocket.name} pocket of ${distributionName}/${series.name}`}
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
      />,
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
      />,
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
                aria-label={`List ${pocket.name} pocket of ${distributionName}/${series.name}`}
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
                    aria-label={`List ${pocket.name} pocket of ${distributionName}/${series.name}`}
                  >
                    {pocket.name}
                  </Button>
                </div>
                <div
                  className={classNames(
                    "p-text--small u-text--muted u-no-margin--bottom",
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
          content: `${pocket.package_count} ${
            pocket.package_count === 1 ? "package" : "packages"
          }`,
          "aria-label": "Content",
        },
        {
          "aria-label": "Actions",
          content: (
            <div className={classes.dividedBlocks}>
              {("mirror" == pocket.mode || "pull" == pocket.mode) && (
                <div className={classes.dividedBlock}>
                  <Button
                    small={isSmall}
                    hasIcon
                    appearance={isSmall ? "base" : ""}
                    className={classNames("u-no-margin--bottom", {
                      "u-no-padding--right p-tooltip--btm-center": isSmall,
                    })}
                    aria-label={
                      "mirror" === pocket.mode
                        ? `Synchronize ${pocket.name} pocket of ${distributionName}/${series.name}`
                        : `Pull packages to ${pocket.name} pocket of ${distributionName}/${series.name}`
                    }
                    onClick={() => {
                      handleSyncPocket(pocket);
                    }}
                  >
                    <i
                      className={classNames("p-icon--change-version", {
                        "u-no-margin--right": isSmall,
                      })}
                    />
                    {isSmall && (
                      <span className="p-tooltip__message">
                        {"mirror" === pocket.mode ? "Sync" : "Pull"}
                      </span>
                    )}
                  </Button>
                </div>
              )}
              <div className={classes.dividedBlock}>
                <Button
                  small={isSmall}
                  hasIcon
                  appearance={isSmall ? "base" : ""}
                  className={classNames("u-no-margin--bottom", {
                    "u-no-padding--right p-tooltip--btm-center": isSmall,
                  })}
                  aria-label={`Edit ${pocket.name} pocket of ${distributionName}/${series.name}`}
                  onClick={() => {
                    handleEditPocket(pocket);
                  }}
                >
                  <i
                    className={classNames("p-icon--edit", {
                      "u-no-margin--right": isSmall,
                    })}
                  />
                  {isSmall && <span className="p-tooltip__message">Edit</span>}
                </Button>
              </div>
              <div className={classes.dividedBlock}>
                <Button
                  small={isSmall}
                  hasIcon
                  appearance={isSmall ? "base" : ""}
                  className={classNames("u-no-margin--bottom", {
                    "u-no-padding--right p-tooltip--btm-center": isSmall,
                  })}
                  aria-label={`Remove ${pocket.name} pocket of ${distributionName}/${series.name}`}
                  onClick={() => {
                    handleRemovePocket(pocket);
                  }}
                >
                  <i
                    className={classNames("p-icon--delete", {
                      "u-no-margin--right": isSmall,
                    })}
                  />
                  {isSmall && (
                    <span className="p-tooltip__message">Delete</span>
                  )}
                </Button>
              </div>
            </div>
          ),
        },
      ],
    };
  });

  return isSmall ? (
    <MainTable
      className={classes.content}
      headers={headers}
      rows={rows}
      emptyStateMsg="No pockets yet"
    />
  ) : (
    series.pockets.map((pocket, index) => (
      <Row
        key={index}
        className={classNames(
          "u-no-padding--left u-no-padding--right",
          classes.pocketWrapper,
        )}
      >
        <Col size={2} small={2}>
          <InfoItem label="Pocket" value={rows[index].columns[0].content} />
        </Col>
        <Col size={2} small={2}>
          <InfoItem label="Last synced" value="" />
        </Col>
        <Col size={2} small={2}>
          <InfoItem label="Mode" value={pocket.mode} />
        </Col>
        <Col size={2} small={2}>
          <InfoItem label="Content" value="" />
        </Col>
        <div className={classes.ctaRow}>{rows[index].columns[4].content}</div>
      </Row>
    ))
  );
};

export default SeriesPocketList;
