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
  // LA061 Phase 1.8: in the new dashboard layout the "Top issues now" column
  // moves out into its own card (`FleetTopIssues`), so the hero widget only
  // renders gauge + band distribution. Default false preserves the original
  // three-column layout for any consumer that doesn't opt in.
  readonly hideTopDetractors?: boolean;
}

// LA061 Phase 1.8: the band list shows the three score bands plus an
// "Unmeasured" 4th row when the account has computers the engine can't
// score (Windows / WSL host / no distribution). The 4th row is intentionally
// not a `HealthBand` — it doesn't have a filter target on the instance list,
// so we model it as a `kind: "unmeasured"` discriminant alongside the three
// score-band rows.
type BandRow =
  | {
      kind: "score";
      band: HealthBand;
      label: string;
      count: number;
    }
  | {
      kind: "unmeasured";
      label: string;
      count: number;
    };

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
  hideTopDetractors = false,
}) => {
  const titleId = useId();
  const descId = useId();

  const rows = useMemo<BandRow[]>(() => {
    if (!summary) return [];
    const baseRows: BandRow[] = [
      { kind: "score", band: "critical", label: "Critical", count: summary.band_critical_count },
      { kind: "score", band: "warning", label: "Warning", count: summary.band_warning_count },
      { kind: "score", band: "healthy", label: "Healthy", count: summary.band_healthy_count },
    ];
    // LA061 Phase 1.8: append a muted Unmeasured row when the account has
    // computers the engine can't score (Windows / WSL host / no
    // distribution). Hidden when zero so the band list doesn't carry an
    // always-empty fourth row.
    const unmeasured =
      summary.unmeasurable_count
      ?? Math.max(
        0,
        summary.total_count - (summary.measurable_count ?? summary.total_count),
      );
    if (unmeasured > 0) {
      baseRows.push({
        kind: "unmeasured",
        label: "Unmeasured",
        count: unmeasured,
      });
    }
    return baseRows;
  }, [summary]);

  if (isLoading || (!summary && !isError)) {
    return (
      <section
        className={classNames(classes.root, {
          [classes.rootCompact]: hideTopDetractors,
        })}
        aria-busy="true"
        aria-label="Loading fleet health"
      >
        <div className={classes.gaugeColumn}>
          <div className={classNames(classes.gaugeSkeleton, classes.shimmer)} />
        </div>
        <div className={classes.middleColumn}>
          <h2 className={classes.heading}>{heading}</h2>
          <p className={classes.description}>{description}</p>
          <div className={classNames(classes.barSkeleton, classes.shimmer)} />
        </div>
        {!hideTopDetractors && (
          <div className={classes.detractorColumn}>
            <h3 className={classes.subheading}>Top issues now</h3>
            <div className={classNames(classes.detractorSkeleton, classes.shimmer)} />
            <div className={classNames(classes.detractorSkeleton, classes.shimmer)} />
            <div className={classNames(classes.detractorSkeleton, classes.shimmer)} />
          </div>
        )}
      </section>
    );
  }

  if (isError || !summary) {
    // The whole widget has no content to render — use EmptyState rather
    // than an inline Notification. The fallback container drops the
    // 3-column grid (no gauge / bands / detractors to place) so the
    // EmptyState spans the full card naturally instead of squeezing into
    // the gauge column.
    return (
      <section className={classes.rootFallback}>
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

  // LA061 Phase 1.8: `measurable_count` is the denominator for the band
  // percentages. `total_count` from the server now equals the count of
  // measured rows in `computer_health_state`, so `measurable_count` and
  // `total_count` agree. We surface `unmeasurable_count` separately as the
  // count of computers the engine couldn't score.
  const measurable = summary.measurable_count ?? total;
  // Backwards-compatible: when the server hasn't shipped
  // `unmeasurable_count` (older API) infer it from the legacy
  // `total - measurable` derivation. Older clients that fed the widget a
  // single `total` keep working.
  const unmeasurable =
    summary.unmeasurable_count ?? Math.max(0, total - measurable);
  const fleetTotal = measurable + unmeasurable;
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
      className={classNames(classes.root, {
        [classes.rootCompact]: hideTopDetractors,
      })}
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
        <p
          id={titleId}
          className={classNames("p-heading--5 u-no-margin--bottom", classes.heading)}
        >
          {heading}
        </p>
        <p id={descId} className={classes.description}>
          {description}
        </p>
        <ul className={classes.bandList}>
          {rows.map((row) => {
            // Unmeasured uses the fleet-wide denominator so its percentage
            // is honest ("3 of 18 instances aren't measurable"). The score
            // bands keep the measurable-only denominator so the three
            // percentages sum to 100%.
            const denominator =
              row.kind === "unmeasured" ? fleetTotal : measurable;
            const pct = denominator > 0
              ? (row.count / denominator) * PERCENT_BASE
              : 0;
            const accessibleLabel =
              row.kind === "unmeasured"
                ? `${row.count} unmeasured instances, ${ROUND(pct)} percent of the fleet`
                : `${row.count} ${row.label.toLowerCase()} instances, ${ROUND(pct)} percent of the measurable fleet`;
            const rowClass = classNames(
              classes.bandRow,
              row.kind === "score"
                ? classes[`band_${row.band}`]
                : classes.band_unmeasured,
            );
            const content = (
              <>
                <span className={classes.bandSwatch} aria-hidden="true" />
                <span className={classes.bandLabel}>{row.label}</span>
                <span className={classes.bandTrack} aria-hidden="true">
                  <span
                    className={classes.bandFill}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className={classes.bandCount}>{row.count}</span>
                <span className={classes.bandPct}>{ROUND(pct)}%</span>
              </>
            );
            if (row.kind === "score") {
              return (
                <li key={row.band}>
                  <Link
                    to={ROUTES.instances.root({ healthBand: [row.band] })}
                    className={rowClass}
                    aria-label={accessibleLabel}
                  >
                    {content}
                  </Link>
                </li>
              );
            }
            // Unmeasured row is informational; no deep-link target on the
            // instance list maps to "the engine can't score these," so we
            // render it as a static row rather than a Link.
            return (
              <li key="unmeasured">
                <div className={rowClass} aria-label={accessibleLabel}>
                  {content}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Top detractors ── */}
      {!hideTopDetractors && (
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
                    <Icon name={d.weight >= HEALTHY_FLOOR ? "error" : "warning"} />
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
      )}

      <footer className={classes.footer}>
        <Icon name="information" />
        <span>
          {measurable} of {fleetTotal} instances measured
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
