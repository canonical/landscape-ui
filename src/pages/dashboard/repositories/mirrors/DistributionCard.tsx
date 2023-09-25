import { FC, useState } from "react";
import SeriesCard from "./SeriesCard";
import { Button, Spinner } from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import useDistributions from "../../../../hooks/useDistributions";
import classes from "./DistributionCard.module.scss";
import useDebug from "../../../../hooks/useDebug";
import { Distribution } from "../../../../types/Distribution";
import useConfirm from "../../../../hooks/useConfirm";
import EmptyDistribution from "./EmptyDistribution";
import classNames from "classnames";
import NewSeriesForm from "./NewSeriesForm";
import { useMediaQuery } from "usehooks-ts";

interface DistributionCardProps {
  distribution: Distribution;
}

const DistributionCard: FC<DistributionCardProps> = ({ distribution }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const isSmall = useMediaQuery("(min-width: 620px)");

  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { removeDistributionQuery } = useDistributions();
  const { mutateAsync: removeDistribution, isLoading: isRemoving } =
    removeDistributionQuery;

  const debug = useDebug();

  const handleRemove = async () => {
    confirmModal({
      title: `Removing ${distribution.name} distribution`,
      body: "Are you sure? This action cannot be undone.",
      buttons: [
        <Button
          key={`delete-${distribution.name}`}
          appearance="negative"
          hasIcon={true}
          aria-label={`Remove ${distribution.name} distribution`}
          onClick={async () => {
            try {
              await removeDistribution({ name: distribution.name });
            } catch (error: unknown) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          {isRemoving && <Spinner />}
          Remove
        </Button>,
      ],
    });
  };

  const AddSeriesButton = ({ className }: { className?: string }) => (
    <Button
      onClick={() => {
        setSidePanelOpen(true);
        setSidePanelContent(
          `Add series to ${distribution.name}`,
          <NewSeriesForm distributionData={distribution} />,
        );
      }}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      aria-label={`Add series to ${distribution.name}`}
      className={className ?? "is-small"}
    >
      Add series
    </Button>
  );

  const RemoveDistributionButton = ({ className }: { className?: string }) => (
    <Button
      onClick={handleRemove}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      aria-label={`Remove ${distribution.name} distribution`}
      disabled={isRemoving}
      className={className ?? "is-small"}
    >
      Remove distribution
    </Button>
  );

  return (
    <div className={classes.item}>
      <div className={classes.titleGroup}>
        <h2
          className={classNames(
            "p-heading--4 u-no-margin--bottom u-no-padding--top",
            classes.title,
          )}
        >
          {distribution.name}
        </h2>
        {isSmall ? (
          <div>
            <AddSeriesButton />
            <RemoveDistributionButton />
          </div>
        ) : (
          <span className="p-contextual-menu--left">
            <Button
              className="p-contextual-menu__toggle"
              aria-controls="menu"
              aria-expanded={openDropdown}
              aria-haspopup="true"
              onClick={() => {
                setOpenDropdown((prevState) => !prevState);
              }}
              onBlur={() => {
                setOpenDropdown(false);
              }}
            >
              Actions
            </Button>
            <span
              className="p-contextual-menu__dropdown"
              id="menu"
              aria-hidden={!openDropdown}
            >
              <AddSeriesButton className="p-contextual-menu__link" />
              <RemoveDistributionButton className="p-contextual-menu__link" />
            </span>
          </span>
        )}
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
