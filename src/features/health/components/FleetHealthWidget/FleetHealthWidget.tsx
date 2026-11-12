import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { Meter } from "@/components/ui";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon } from "@canonical/react-components";
import { Card } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { useId } from "react";
import { Link } from "react-router";
import { BAND_CRITICALITY, BAND_ICON, BAND_LABEL } from "../../helpers";
import type { FleetHealthSummary, HealthBand } from "../../types";
import classes from "./FleetHealthWidget.module.scss";

// Band thresholds mirror the server-side defaults.
const HEALTHY_FLOOR = 61;
const CRITICAL_CEILING = 25;
const PERCENT_BASE = 100;

// Band midpoints, used only when the server omits `average_score`.
const BAND_MIDPOINT: Record<HealthBand, number> = {
  critical: 10,
  warning: 50,
  healthy: 90,
};

const BANDS: HealthBand[] = ["critical", "warning", "healthy"];

const bandForScore = (score: number): HealthBand => {
  if (score <= CRITICAL_CEILING) {
    return "critical";
  }
  if (score < HEALTHY_FLOOR) {
    return "warning";
  }
  return "healthy";
};

const getBandCount = (summary: FleetHealthSummary, band: HealthBand): number =>
  summary[`band_${band}_count`];

const getAverageScore = (summary: FleetHealthSummary): number => {
  if (typeof summary.average_score === "number") {
    return summary.average_score;
  }
  if (summary.total_count === 0) {
    return 0;
  }
  const weighted = BANDS.reduce(
    (sum, band) => sum + getBandCount(summary, band) * BAND_MIDPOINT[band],
    0,
  );
  return Math.round(weighted / summary.total_count);
};

const getPercent = (count: number, total: number): number =>
  total > 0 ? Math.round((count / total) * PERCENT_BASE) : 0;

interface FleetHealthWidgetProps {
  readonly summary: FleetHealthSummary | undefined;
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly onRetry?: () => void;
  readonly isRetrying?: boolean;
  readonly className?: string;
}

const FleetHealthWidget: FC<FleetHealthWidgetProps> = ({
  summary,
  isLoading,
  isError,
  onRetry,
  isRetrying,
  className,
}) => {
  const titleId = useId();

  const renderCard = (content: ReactNode, footer?: ReactNode) => (
    <Card className={className} aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="p-heading--5 u-no-margin u-no-padding">
          Fleet health
        </h2>
        {summary?.updated_at ? (
          <p className={classes.updated}>
            Updated{" "}
            <time dateTime={summary.updated_at}>
              {date(summary.updated_at).format(DISPLAY_DATE_TIME_FORMAT)}
            </time>
          </p>
        ) : null}
      </Card.Header>
      <Card.Content>{content}</Card.Content>
      {footer ? <Card.Footer>{footer}</Card.Footer> : null}
    </Card>
  );

  if (isLoading || (!summary && !isError)) {
    return renderCard(<LoadingState />);
  }

  if (isError || !summary) {
    return renderCard(
      <EmptyState
        title="Fleet health unavailable"
        icon="error"
        body={
          <p>
            We couldn&apos;t load the fleet health summary. This is usually
            transient, so check back in a moment.
          </p>
        }
        cta={
          onRetry
            ? [
                <Button
                  type="button"
                  key="retry"
                  appearance="positive"
                  onClick={onRetry}
                  disabled={isRetrying}
                >
                  {isRetrying ? "Retrying…" : "Retry"}
                </Button>,
              ]
            : []
        }
      />,
    );
  }

  const total = summary.total_count;

  if (total === 0) {
    return renderCard(
      <EmptyState
        title="No instances yet"
        icon="information"
        body={<p>Register a computer to start seeing fleet health here.</p>}
      />,
    );
  }

  const measurable = summary.measurable_count ?? total;
  const unmeasurable =
    summary.unmeasurable_count ?? Math.max(0, total - measurable);
  const fleetTotal = measurable + unmeasurable;
  const score = getAverageScore(summary);
  const scoreBand = bandForScore(score);

  const footer = (
    <p className={classes.footnote}>
      {measurable} of {fleetTotal} instances measured
      {unmeasurable > 0
        ? ` · ${unmeasurable} non-Ubuntu ${pluralize(unmeasurable, ["instance"])} can't be measured`
        : null}
    </p>
  );

  return renderCard(
    <div className={classes.layout}>
      <div className={classes.score}>
        <p className={classes.scoreLine}>
          <span className={classes.scoreValue}>{score}</span>
          <span className={classes.scoreMax}>/ 100</span>
          <span
            className={classNames(classes.band, BAND_CRITICALITY[scoreBand])}
          >
            <Icon name={BAND_ICON[scoreBand]} />
            {BAND_LABEL[scoreBand]}
          </span>
        </p>
        <Meter
          value={score}
          criticality={BAND_CRITICALITY[scoreBand]}
          aria-label={`Average health score ${score} of 100, ${BAND_LABEL[scoreBand]}`}
        />
        <p className={classes.hint}>
          Average score across measurable instances.
        </p>
      </div>

      <ul className={classes.distribution}>
        {BANDS.map((band) => {
          const count = getBandCount(summary, band);
          const percent = getPercent(count, measurable);
          return (
            <li key={band}>
              <Link
                to={ROUTES.instances.root({ healthBand: [band] })}
                className={classes.row}
                aria-label={`${BAND_LABEL[band]}: ${count} ${pluralize(count, ["instance"])}, ${percent} percent of the measurable fleet`}
              >
                <span className={classes.rowLabel}>{BAND_LABEL[band]}</span>
                <Meter
                  value={percent}
                  criticality={BAND_CRITICALITY[band]}
                  aria-hidden="true"
                />
                <span className={classes.rowCount}>{count}</span>
                <span className={classes.rowPercent}>{percent}%</span>
              </Link>
            </li>
          );
        })}
        {unmeasurable > 0 ? (
          <li className={classes.row}>
            <span className={classes.rowLabel}>Unmeasured</span>
            <Meter
              value={getPercent(unmeasurable, fleetTotal)}
              aria-hidden="true"
            />
            <span className={classes.rowCount}>{unmeasurable}</span>
            <span className={classes.rowPercent}>
              {getPercent(unmeasurable, fleetTotal)}%
            </span>
          </li>
        ) : null}
      </ul>
    </div>,
    footer,
  );
};

export default FleetHealthWidget;
