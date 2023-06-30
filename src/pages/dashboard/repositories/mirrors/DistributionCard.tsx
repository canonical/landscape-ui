import { FC } from "react";
import SeriesCard from "./SeriesCard";
import { Button, Spinner } from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import NewSeriesForm from "./NewSeriesForm";
import useDistributions from "../../../../hooks/useDistributions";
import classes from "./DistributionCard.module.scss";
import useDebug from "../../../../hooks/useDebug";
import { Distribution } from "../../../../types/Distribution";
import useConfirm from "../../../../hooks/useConfirm";
import EmptyDistribution from "./EmptyDistribution";

interface DistributionCardProps {
  distribution: Distribution;
}

const DistributionCard: FC<DistributionCardProps> = ({ distribution }) => {
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { removeDistributionQuery } = useDistributions();
  const { mutateAsync: removeDistribution, isLoading: isRemoving } =
    removeDistributionQuery;

  const debug = useDebug();

  const handleRemove = async () => {
    confirmModal({
      title: "Remove distribution",
      body: "Are you sure? This action cannot be undone.",
      buttons: [
        <Button
          key={`delete-${distribution.name}`}
          appearance="negative"
          hasIcon={true}
          onClick={async () => {
            try {
              await removeDistribution({ name: distribution.name });

              closeConfirmModal();
            } catch (error: unknown) {
              debug(error);
            }
          }}
        >
          {isRemoving && <Spinner />}
          Remove
        </Button>,
      ],
    });
  };

  return (
    <div className={classes.item}>
      <div className={classes.titleGroup}>
        <h2 className="p-heading--4 u-no-margin--bottom">
          {distribution.name}
        </h2>
        <div>
          <Button
            small
            onClick={() => {
              setSidePanelOpen(true);
              setSidePanelContent(
                `Add series for ${distribution.name}`,
                <NewSeriesForm distribution={distribution} />
              );
            }}
          >
            Add series
          </Button>
          <Button
            onClick={handleRemove}
            small
            aria-label={`Remove ${distribution.name} distribution`}
            disabled={isRemoving}
          >
            Remove distribution
          </Button>
        </div>
      </div>
      {0 === distribution.series.length && (
        <EmptyDistribution distribution={distribution} />
      )}
      {distribution.series.length > 0 &&
        distribution.series.map((series) => (
          <SeriesCard
            key={series.name}
            distribution={distribution}
            series={series}
          />
        ))}
    </div>
  );
};

export default DistributionCard;
