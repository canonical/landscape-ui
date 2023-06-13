import { Series } from "../../../types/Series";
import { FC } from "react";
import { Button, MainTable } from "@canonical/react-components";
import { Pocket } from "../../../types/Pocket";
import { Distribution } from "../../../types/Distribution";
import usePockets from "../../../hooks/usePockets";
import useDebug from "../../../hooks/useDebug";
import useConfirm from "../../../hooks/useConfirm";
import useSidePanel from "../../../hooks/useSidePanel";
import EditPocketForm from "./EditPocketForm";
import classNames from "classnames";
import PackageList from "./PackageList";

interface SeriesPocketListProps {
  distribution: Distribution;
  series: Series;
}

const SeriesPocketList: FC<SeriesPocketListProps> = ({
  distribution,
  series,
}) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { removePocketQuery } = usePockets();
  const {
    mutate: removePocket,
    isLoading: isRemovingPocket,
    error: removePocketError,
  } = removePocketQuery;

  if (removePocketError) {
    debug(removePocketError);
  }

  const headers = [
    { content: "Pocket" },
    { content: "Mode" },
    { content: "Last synced" },
    { content: "Content" },
    {},
  ];

  const rows = series.pockets.map((pocket) => {
    const handleEditPocket = () => {
      setSidePanelOpen(true);
      setSidePanelContent(
        `Edit ${pocket.name} pocket`,
        <EditPocketForm
          pocket={pocket}
          distribution={distribution}
          series={series}
        />
      );
    };

    const handleRemovePocket = () => {
      confirmModal({
        body: `Do you really want to delete ${pocket.name} pocket from ${series.name} series of ${distribution.name} distribution?`,
        title: "Deleting pocket",
        buttons: [
          <Button
            key={`delete-${pocket.name}-pocket`}
            appearance="negative"
            disabled={isRemovingPocket}
            onClick={() => {
              removePocket({
                distribution: distribution.name,
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

    const handleSyncPocket = (pocket: Pocket) => {
      setSidePanelOpen(true);
      setSidePanelContent(
        `${series.name} ${pocket.name}`,
        <PackageList
          pocket={pocket}
          distribution={distribution}
          series={series}
        />
      );
    };

    return {
      columns: [
        {
          content:
            "pull" !== pocket.mode ? (
              pocket.name
            ) : (
              <>
                <div>{pocket.name}</div>
                <div
                  className={classNames("p-text--small u-text--muted")}
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
              <Button
                hasIcon
                appearance="base"
                className="u-no-margin--bottom"
                aria-label={`Edit ${pocket.name} pocket`}
                onClick={() => {
                  handleEditPocket();
                }}
              >
                <i className="p-icon--edit" />
              </Button>
              <Button
                hasIcon
                appearance="base"
                className="u-no-margin--bottom"
                aria-label={`Remove ${pocket.name} pocket`}
                onClick={handleRemovePocket}
              >
                <i className="p-icon--delete" />
              </Button>
              <Button
                hasIcon
                appearance="base"
                className="u-no-margin--bottom"
                aria-label={`Synchronize ${pocket.name} pocket`}
                onClick={() => {
                  handleSyncPocket(pocket);
                }}
              >
                <i className="p-icon--change-version" />
              </Button>
            </>
          ),
        },
      ],
    };
  });

  return (
    <MainTable headers={headers} rows={rows} emptyStateMsg="No pockets yet" />
  );
};

export default SeriesPocketList;
