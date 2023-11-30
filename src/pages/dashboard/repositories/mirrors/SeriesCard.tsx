import { FC, lazy, Suspense, useEffect, useState } from "react";
import SeriesPocketList from "./SeriesPocketList";
import classes from "./SeriesCard.module.scss";
import { Button, Spinner } from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import { Series } from "../../../../types/Series";
import useSeries from "../../../../hooks/useSeries";
import useDebug from "../../../../hooks/useDebug";
import { Distribution } from "../../../../types/Distribution";
import useConfirm from "../../../../hooks/useConfirm";
import { useMediaQuery } from "usehooks-ts";
import {
  DEFAULT_SNAPSHOT_URI,
  DISPLAY_DATE_FORMAT,
} from "../../../../constants";
import moment from "moment";
import classNames from "classnames";
import LoadingState from "../../../../components/layout/LoadingState";

const NewPocketForm = lazy(() => import("./NewPocketForm"));

const DeriveSeriesForm = lazy(() => import("./DeriveSeriesForm"));

interface SeriesCardProps {
  distribution: Distribution;
  series: Series;
}

const SeriesCard: FC<SeriesCardProps> = ({ distribution, series }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [snapshotDate, setSnapshotDate] = useState("");

  useEffect(() => {
    if (
      !series ||
      !series.pockets.length ||
      series.pockets[0].mode !== "mirror" ||
      !series.pockets[0].mirror_uri.startsWith(DEFAULT_SNAPSHOT_URI)
    ) {
      return;
    }

    setSnapshotDate(
      series.pockets[0].mirror_uri.replace(/^.*\/(\d{8})T\d{6}Z$/, "$1"),
    );
  }, [series]);

  const isSmall = useMediaQuery("(min-width: 620px)");

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
            } catch (error: unknown) {
              debug(error);
            } finally {
              closeConfirmModal();
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

  const DeriveSeriesButton = ({ className }: { className?: string }) => (
    <Button
      onClick={() => {
        setSidePanelOpen(true);
        setSidePanelContent(
          "Derive series",
          <Suspense fallback={<LoadingState />}>
            <DeriveSeriesForm
              distribution={distribution}
              origin={series.name}
            />
          </Suspense>,
        );
      }}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      aria-label={`Derive series ${distribution.name}/${series.name}`}
      className={className ?? "is-small"}
    >
      Derive series
    </Button>
  );

  const AddPocketButton = ({ className }: { className?: string }) => (
    <Button
      onClick={() => {
        setSidePanelOpen(true);
        setSidePanelContent(
          `New pocket for ${series.name}`,
          <Suspense fallback={<LoadingState />}>
            <NewPocketForm distribution={distribution} series={series} />
          </Suspense>,
        );
      }}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      aria-label={`Create new pocket for ${distribution.name}/${series.name}`}
      className={className ?? "is-small"}
    >
      New pocket
    </Button>
  );

  const RemoveSeriesButton = ({ className }: { className?: string }) => (
    <Button
      onClick={handleRemove}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      disabled={isRemoving}
      aria-label={`Remove ${distribution.name}/${series.name}`}
      className={className ?? "is-small"}
    >
      Remove
    </Button>
  );

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <h3 className={classes.title}>{series.name}</h3>
        {!!snapshotDate && (
          <span
            className={classNames("u-text--muted", classes.snapshot)}
          >{`Snapshot from ${moment(snapshotDate).format(
            DISPLAY_DATE_FORMAT,
          )}`}</span>
        )}
        {isSmall ? (
          <div className={classes.cta}>
            {!snapshotDate && (
              <>
                <DeriveSeriesButton />
                <AddPocketButton />
              </>
            )}
            <RemoveSeriesButton />
          </div>
        ) : (
          <span className="p-contextual-menu">
            <Button
              className="p-contextual-menu__toggle u-no-margin--bottom"
              aria-controls="series-cta"
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
              id="series-cta"
              aria-hidden={!openDropdown}
            >
              {!snapshotDate && (
                <>
                  <DeriveSeriesButton className="p-contextual-menu__link" />
                  <AddPocketButton className="p-contextual-menu__link" />
                </>
              )}
              <RemoveSeriesButton className="p-contextual-menu__link" />
            </span>
          </span>
        )}
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
