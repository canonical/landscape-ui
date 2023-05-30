import { FC } from "react";
import SeriesPocketList from "./SeriesPocketList";
import classes from "./SeriesCard.module.scss";
import { Button } from "@canonical/react-components";
import NewSeriesForm from "./NewSeriesForm";
import useSidePanel from "../../../hooks/useSidePanel";
import { Series } from "../../../types/Series";
import useSeries from "../../../hooks/useSeries";
import useDebug from "../../../hooks/useDebug";
import { Distribution } from "../../../types/Distribution";
import SnapshotForm from "./SnapshotForm";

interface SeriesCardProps {
  distribution: Distribution;
  series: Series;
}

const SeriesCard: FC<SeriesCardProps> = ({ distribution, series }) => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { removeSeriesQuery } = useSeries();
  const debug = useDebug();

  const { mutateAsync: removeSeries, isLoading: isRemoving } =
    removeSeriesQuery;

  const handleRemove = async () => {
    try {
      await removeSeries({
        name: series.name,
        distribution: distribution.name,
      });
    } catch (error: any) {
      debug(error);
    }
  };

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <h3 className={classes.title}>{series.name}</h3>
        <div className={classes.cta}>
          <Button
            dense
            onClick={() => {
              setSidePanelOpen(true);
              setSidePanelContent(
                "Create snapshot",
                <SnapshotForm
                  distribution={distribution.name}
                  origin={series.name}
                />
              );
            }}
          >
            Create snapshot
          </Button>
          <Button
            dense
            onClick={() => {
              setSidePanelOpen(true);
              setSidePanelContent(
                `New pocket for ${series.name}`,
                <NewSeriesForm distribution={series.name} />
              );
            }}
          >
            New pocket
          </Button>
          <Button onClick={handleRemove} dense disabled={isRemoving}>
            Remove
          </Button>
        </div>
      </div>
      <div className={classes.content}>
        <SeriesPocketList series={series} />
      </div>
    </div>
  );
};

export default SeriesCard;
