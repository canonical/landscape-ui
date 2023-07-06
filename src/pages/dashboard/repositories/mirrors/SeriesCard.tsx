import { FC } from "react";
import SeriesPocketList from "./SeriesPocketList";
import classes from "./SeriesCard.module.scss";
import { Button, Spinner } from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import { Series } from "../../../../types/Series";
import useSeries from "../../../../hooks/useSeries";
import useDebug from "../../../../hooks/useDebug";
import { Distribution } from "../../../../types/Distribution";
import SnapshotForm from "./SnapshotForm";
import useConfirm from "../../../../hooks/useConfirm";
import NewPocketForm from "./NewPocketForm";

interface SeriesCardProps {
  distribution: Distribution;
  series: Series;
}

const SeriesCard: FC<SeriesCardProps> = ({ distribution, series }) => {
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { removeSeriesQuery } = useSeries();
  const debug = useDebug();

  const { mutateAsync: removeSeries, isLoading: isRemoving } =
    removeSeriesQuery;

  const handleRemove = async () => {
    confirmModal({
      title: "Remove series",
      body: "Are you sure? This action cannot be undone.",
      buttons: [
        <Button
          key={`delete-${series.name}`}
          appearance="negative"
          hasIcon={true}
          onClick={async () => {
            try {
              await removeSeries({
                name: series.name,
                distribution: distribution.name,
              });

              closeConfirmModal();
            } catch (error: unknown) {
              debug(error);
            }
          }}
          aria-label={`Remove ${series.name} from ${distribution.name}`}
        >
          {isRemoving && <Spinner />}
          Remove
        </Button>,
      ],
    });
  };

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <h3 className={classes.title}>{series.name}</h3>
        <div className={classes.cta}>
          <Button
            small
            onClick={() => {
              setSidePanelOpen(true);
              setSidePanelContent(
                "Create snapshot",
                <SnapshotForm
                  distribution={distribution}
                  origin={series.name}
                />
              );
            }}
            aria-label={`Create snapshot for ${distribution.name}/${series.name}`}
          >
            Create snapshot
          </Button>
          <Button
            small
            onClick={() => {
              setSidePanelOpen(true);
              setSidePanelContent(
                `New pocket for ${series.name}`,
                <NewPocketForm distribution={distribution} series={series} />
              );
            }}
            aria-label={`Create new pocket for ${distribution.name}/${series.name}`}
          >
            New pocket
          </Button>
          <Button
            onClick={handleRemove}
            small
            disabled={isRemoving}
            aria-label={`Remove ${distribution.name}/${series.name}`}
          >
            Remove
          </Button>
        </div>
      </div>
      <div className={classes.content}>
        <SeriesPocketList
          distributionName={distribution.name}
          series={series}
        />
      </div>
    </div>
  );
};

export default SeriesCard;
