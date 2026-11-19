import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { Meter } from "@/components/ui";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import { pluralize } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { Card } from "@canonical/react-ds-global";
import type { FC, ReactNode } from "react";
import { useId } from "react";
import { Link } from "react-router";
import { BAND_CRITICALITY, BAND_LABEL } from "../../helpers";
import type {
  FleetHealthSummary,
  FleetHealthThresholds,
  HealthBand,
} from "../../types";
import HealthScoreSummary from "../HealthScoreSummary";
import classes from "./FleetHealthWidget.module.scss";

const PERCENT_BASE = 100;

const BANDS: HealthBand[] = ["critical", "warning", "healthy"];

/** Returns the band of a score under the thresholds the server reports. */
const bandForScore = (
  score: number,
  { critical_max, warning_max }: FleetHealthThresholds,
): HealthBand => {
  if (score <= critical_max) {
    return "critical";
  }
  return score <= warning_max ? "warning" : "healthy";
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

  const measured = summary.measured_count;
  const unmeasured = summary.bands.unmeasured;

  const footer = (
    <p className={classes.footnote}>
      {measured} of {total} instances measured
      {summary.recompute_in_progress
        ? " · Scores are being computed, so these counts are partial"
        : null}
    </p>
  );

  return renderCard(
    <div className={classes.layout}>
      {summary.average_score === null ? (
        <p className="u-text--muted">No instance has a score yet.</p>
      ) : (
        <HealthScoreSummary
          score={summary.average_score}
          band={bandForScore(summary.average_score, summary.thresholds)}
          label="Average health score"
          hint="Average score across measured instances."
        />
      )}

      <ul className={classes.distribution}>
        {BANDS.map((band) => {
          const count = summary.bands[band];
          const percent = getPercent(count, measured);
          return (
            <li key={band}>
              <Link
                to={ROUTES.instances.root({ healthBand: [band] })}
                className={classes.row}
                aria-label={`${BAND_LABEL[band]}: ${count} ${pluralize(count, ["instance"])}, ${percent} percent of the measured fleet`}
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
        {unmeasured > 0 ? (
          <li>
            <Link
              to={ROUTES.instances.root({ healthBand: ["unmeasured"] })}
              className={classes.row}
              aria-label={`Unmeasured: ${unmeasured} ${pluralize(unmeasured, ["instance"])}, ${getPercent(unmeasured, total)} percent of the fleet`}
            >
              <span className={classes.rowLabel}>Unmeasured</span>
              <Meter
                className={classes.unmeasured}
                value={getPercent(unmeasured, total)}
                aria-hidden="true"
              />
              <span className={classes.rowCount}>{unmeasured}</span>
              <span className={classes.rowPercent}>
                {getPercent(unmeasured, total)}%
              </span>
            </Link>
          </li>
        ) : null}
      </ul>
    </div>,
    footer,
  );
};

export default FleetHealthWidget;
