import EmptyState from "@/components/layout/EmptyState";
import { ROUTES } from "@/libs/routes";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useId, useMemo } from "react";
import { Link } from "react-router";
import type {
  FleetHealthSummary,
  FleetTopDetractor,
  HealthBand,
} from "../../types";
import classes from "./FleetHealthWidget.module.scss";

// ── Score gauge geometry ──
// A 270° sweep speedometer (from -135° to +135°) reads as a single
// number better than a closed donut. We render two stroked arcs: a
// muted track + a colored progress arc whose dasharray scales with the
// score (0–100).
const GAUGE_VIEW = 200;
const GAUGE_CENTER = GAUGE_VIEW / 2;
const GAUGE_RADIUS = 78;
const GAUGE_STROKE_WIDTH = 14;
const GAUGE_SWEEP_DEGREES = 270;
const FULL_DEGREES = 360;
const QUARTER_DEGREES = 90;
const FULL_CIRCLE = 2 * Math.PI * GAUGE_RADIUS;
const GAUGE_ARC_LENGTH = FULL_CIRCLE * (GAUGE_SWEEP_DEGREES / FULL_DEGREES);
const GAUGE_GAP = FULL_CIRCLE - GAUGE_ARC_LENGTH;
// Y-offsets, relative to the gauge center, for the three stacked
// labels — score, unit, and band — that sit inside the open bottom of
// the sweep.
const SCORE_Y_OFFSET = -6;
const UNIT_Y_OFFSET = 20;
const BAND_Y_OFFSET = 44;

// Band thresholds — mirror the server-side default. The Overview won't
// know about per-account customisations until LA061 Phase 2, but the
// score we render comes from the server so it already reflects whatever
// thresholds the account is configured with.
const HEALTHY_FLOOR = 61;
const CRITICAL_CEILING = 25;

const PERCENT_BASE = 100;
const ROUND = (n: number) => Math.round(n);

const bandForScore = (score: number): HealthBand => {
  if (score <= CRITICAL_CEILING) return "critical";
  if (score < HEALTHY_FLOOR) return "warning";
  return "healthy";
};

const BAND_LABEL: Record<HealthBand, string> = {
  critical: "Critical",
  warning: "Warning",
  healthy: "Healthy",
};

interface FleetHealthWidgetProps {
  readonly summary: FleetHealthSummary | undefined;
  readonly topDetractors?: FleetTopDetractor[];
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  // Optional retry callback wired by the OverviewPage container. When the
  // widget can't load, an EmptyState surfaces a Retry button if a callback
  // is provided.
  readonly onRetry?: () => void;
  readonly isRetrying?: boolean;
  readonly heading?: string;
  readonly description?: string;
}

interface BandRow {
  band: HealthBand;
  label: string;
  count: number;
}

const computeAverage = (summary: FleetHealthSummary): number => {
  if (typeof summary.average_score === "number") {
    return summary.average_score;
  }
  // Fallback: synthesise an average from band midpoints. Not strictly
  // accurate but always sane — used only when the server hasn't started
  // emitting `average_score` yet.
  const { total_count, band_critical_count, band_warning_count } = summary;
  if (total_count === 0) return 0;
  const HEALTHY_MID = 90;
  const WARNING_MID = 50;
  const CRITICAL_MID = 10;
  const healthy = summary.band_healthy_count * HEALTHY_MID;
  const warning = band_warning_count * WARNING_MID;
  const critical = band_critical_count * CRITICAL_MID;
  return ROUND((healthy + warning + critical) / total_count);
};

const FleetHealthWidget: FC<FleetHealthWidgetProps> = ({
  summary,
  topDetractors,
  isLoading,
  isError,
  onRetry,
  isRetrying,
  heading = "Fleet health",
  description = "Average score across measurable instances and the issues dragging it down.",
}) => {
  const titleId = useId();
  const descId = useId();

  const rows = useMemo<BandRow[]>(() => {
    if (!summary) return [];
    return [
      { band: "critical", label: "Critical", count: summary.band_critical_count },
      { band: "warning", label: "Warning", count: summary.band_warning_count },
      { band: "healthy", label: "Healthy", count: summary.band_healthy_count },
    ];
  }, [summary]);

  if (isLoading || (!summary && !isError)) {
    return (
      <section className={classes.root} aria-busy="true" aria-label="Loading fleet health">
        <div className={classes.gaugeColumn}>
          <div className={classNames(classes.gaugeSkeleton, classes.shimmer)} />
        </div>
        <div className={classes.middleColumn}>
          <h2 className={classes.heading}>{heading}</h2>
          <p className={classes.description}>{description}</p>
          <div className={classNames(classes.barSkeleton, classes.shimmer)} />
        </div>
        <div className={classes.detractorColumn}>
          <h3 className={classes.subheading}>Top issues now</h3>
          <div className={classNames(classes.detractorSkeleton, classes.shimmer)} />
          <div className={classNames(classes.detractorSkeleton, classes.shimmer)} />
          <div className={classNames(classes.detractorSkeleton, classes.shimmer)} />
        </div>
      </section>
    );
  }

  if (isError || !summary) {
    // The whole widget has no content to render — use EmptyState rather
    // than an inline Notification.
    return (
      <section className={classes.root}>
        <EmptyState
          title="Fleet health unavailable"
          icon="error"
          body={
            <p>
              We couldn&apos;t load the fleet health summary. This is
              usually transient — check back in a moment.
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
        />
      </section>
    );
  }

  const total = summary.total_count;

  if (total === 0) {
    return (
      <section className={classes.root}>
        <div className={classes.empty}>
          <Icon name="information" />
          <div>
            <strong>No instances yet</strong>
            <p>
              Register a computer to start seeing fleet health here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const measurable = summary.measurable_count ?? total;
  const unmeasurable = Math.max(0, total - measurable);
  const score = computeAverage(summary);
  const scoreBand = bandForScore(score);
  const gaugeProgress = (Math.max(0, Math.min(100, score)) / PERCENT_BASE) *
    GAUGE_ARC_LENGTH;
  // Rotate the start by half the missing portion so the arc is centered
  // at the bottom of the gauge (open end at 6 o'clock).
  const GAUGE_START_ROTATION = -QUARTER_DEGREES - GAUGE_SWEEP_DEGREES / 2;

  const detractors = topDetractors ?? [];

  return (
    <section
      className={classes.root}
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* ── Score gauge ── */}
      <div className={classes.gaugeColumn}>
        <svg
          className={classNames(
            classes.gauge,
            classes[`gauge_${scoreBand}`],
          )}
          viewBox={`0 0 ${GAUGE_VIEW} ${GAUGE_VIEW}`}
          role="img"
          aria-label={`Average health score ${score} of 100, ${BAND_LABEL[scoreBand]}`}
        >
          <circle
            cx={GAUGE_CENTER}
            cy={GAUGE_CENTER}
            r={GAUGE_RADIUS}
            className={classes.gaugeTrack}
            strokeWidth={GAUGE_STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${GAUGE_ARC_LENGTH} ${GAUGE_GAP}`}
            transform={`rotate(${GAUGE_START_ROTATION} ${GAUGE_CENTER} ${GAUGE_CENTER})`}
            strokeLinecap="round"
          />
          <circle
            cx={GAUGE_CENTER}
            cy={GAUGE_CENTER}
            r={GAUGE_RADIUS}
            className={classes.gaugeProgress}
            strokeWidth={GAUGE_STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${gaugeProgress} ${FULL_CIRCLE}`}
            transform={`rotate(${GAUGE_START_ROTATION} ${GAUGE_CENTER} ${GAUGE_CENTER})`}
            strokeLinecap="round"
          />
          <text
            x={GAUGE_CENTER}
            y={GAUGE_CENTER + SCORE_Y_OFFSET}
            className={classes.gaugeNumber}
            aria-hidden="true"
          >
            {score}
          </text>
          <text
            x={GAUGE_CENTER}
            y={GAUGE_CENTER + UNIT_Y_OFFSET}
            className={classes.gaugeUnit}
            aria-hidden="true"
          >
            / 100
          </text>
          <text
            x={GAUGE_CENTER}
            y={GAUGE_CENTER + BAND_Y_OFFSET}
            className={classes.gaugeBand}
            aria-hidden="true"
          >
            {BAND_LABEL[scoreBand].toUpperCase()}
          </text>
        </svg>
      </div>

      {/* ── Heading + distribution ── */}
      <div className={classes.middleColumn}>
        <h2 id={titleId} className={classes.heading}>
          {heading}
        </h2>
        <p id={descId} className={classes.description}>
          {description}
        </p>
        <ul className={classes.bandList}>
          {rows.map(({ band, label, count }) => {
            const pct = measurable > 0 ? (count / measurable) * PERCENT_BASE : 0;
            return (
              <li key={band}>
                <Link
                  to={ROUTES.instances.root({ healthBand: [band] })}
                  className={classNames(classes.bandRow, classes[`band_${band}`])}
                  aria-label={`${count} ${label.toLowerCase()} instances, ${ROUND(pct)} percent of the measurable fleet`}
                >
                  <span className={classes.bandSwatch} aria-hidden="true" />
                  <span className={classes.bandLabel}>{label}</span>
                  <span className={classes.bandTrack} aria-hidden="true">
                    <span
                      className={classes.bandFill}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className={classes.bandCount}>{count}</span>
                  <span className={classes.bandPct}>{ROUND(pct)}%</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Top detractors ── */}
      <div className={classes.detractorColumn}>
        <h3 className={classes.subheading}>Top issues now</h3>
        {detractors.length === 0 ? (
          <p className={classes.detractorEmpty}>
            <Icon name="success" /> No factors are dragging the fleet down.
          </p>
        ) : (
          <ul className={classes.detractorList}>
            {detractors.map((d) => (
              <li key={d.rule_id}>
                <Link
                  to={ROUTES.instances.root({
                    healthBand:
                      d.weight >= HEALTHY_FLOOR
                        ? ["critical"]
                        : ["critical", "warning"],
                  })}
                  className={classes.detractorRow}
                >
                  <span
                    className={classNames(
                      classes.detractorIcon,
                      d.weight >= HEALTHY_FLOOR && classes.detractorIconCritical,
                    )}
                    aria-hidden="true"
                  >
                    <Icon name={d.weight >= HEALTHY_FLOOR ? "error" : "warning"} />
                  </span>
                  <span className={classes.detractorBody}>
                    <span className={classes.detractorCount}>
                      {d.computer_count} {d.computer_count === 1 ? "instance" : "instances"}
                    </span>
                    <span className={classes.detractorText}>
                      {d.description}
                    </span>
                  </span>
                  <Icon name="chevron-right" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className={classes.footer}>
        <Icon name="information" />
        <span>
          {measurable} of {total} instances measured
          {unmeasurable > 0 ? (
            <>
              {" · "}
              <span>{unmeasurable} non-Ubuntu instance{unmeasurable === 1 ? "" : "s"} can&apos;t be measured</span>
            </>
          ) : null}
          {summary.updated_at && (
            <>
              {" · Updated "}
              <time dateTime={summary.updated_at}>
                {new Date(summary.updated_at).toLocaleString()}
              </time>
            </>
          )}
        </span>
      </footer>
    </section>
  );
};

export default FleetHealthWidget;
