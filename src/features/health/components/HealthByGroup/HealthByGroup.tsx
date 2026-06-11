// LA061 Phase 1.8: Health by Group widget. Stacked-bar grid showing band
// counts grouped by tag / distribution / account. Top-10 + "other" rollup;
// click a row to deep-link to the instance list with the right
// `health_band` + `tag=` (or `distribution=`) pre-applied.

import useHealthSummaryByGroup from "../../hooks/useHealthSummaryByGroup";
import { ROUTES } from "@/libs/routes";
import { Select } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useState } from "react";
import { Link } from "react-router";
import type {
  FleetHealthSummaryGroupRow,
} from "@/tests/mocks/health";
import type { HealthBand } from "../../types";
import type { HealthGroupBy } from "../../types";
import classes from "./HealthByGroup.module.scss";

// The Overview is scoped to one account at a time, so "Account" isn't a
// useful pivot here. The server endpoint still supports it for the future
// super-admin cross-account view; we just don't surface it on the
// dashboard.
const GROUP_OPTIONS: { label: string; value: HealthGroupBy }[] = [
  { label: "Tag", value: "tag" },
  { label: "Distribution", value: "distribution" },
];

interface GroupRowProps {
  readonly row: FleetHealthSummaryGroupRow;
  readonly groupBy: HealthGroupBy;
}

const GroupRow: FC<GroupRowProps> = ({ row, groupBy }) => {
  const total = row.total_count || 1;
  const critPct = (row.band_critical_count / total) * 100;
  const warnPct = (row.band_warning_count / total) * 100;
  const healPct = (row.band_healthy_count / total) * 100;
  // Deep-link target: the instance list, pre-filtered. The "other" rollup
  // doesn't correspond to a concrete tag, so it isn't a navigable row.
  const isOther = row.group === "other";
  // Show worst-band first by default — operators clicking the row are
  // usually chasing the red. The instance list reads `healthBand` (a
  // page-params `string[]`) and `tags` from the URL, so we route through
  // ROUTES.instances.root which goes through `buildUrl` (comma-joins
  // arrays, the form pageParamsManager expects).
  const worstBand: HealthBand | null =
    row.band_critical_count > 0
      ? "critical"
      : row.band_warning_count > 0
        ? "warning"
        : null;
  const href = ROUTES.instances.root({
    ...(worstBand ? { healthBand: [worstBand] } : {}),
    ...(groupBy === "tag" && !isOther ? { tags: [row.group] } : {}),
  });
  const labelCell = isOther ? (
    <span className={classes.groupLabel}>Other</span>
  ) : (
    <Link className={classes.groupLabel} to={href}>
      {row.group}
    </Link>
  );
  return (
    <>
      {labelCell}
      <div
        className={classes.bar}
        role="img"
        aria-label={
          `${row.group}: ${row.band_critical_count} critical, `
          + `${row.band_warning_count} warning, ${row.band_healthy_count} healthy`
        }
      >
        {row.band_critical_count > 0 && (
          <span
            className={classNames(classes.segment, classes.segmentCritical)}
            style={{ width: `${critPct}%` }}
          />
        )}
        {row.band_warning_count > 0 && (
          <span
            className={classNames(classes.segment, classes.segmentWarning)}
            style={{ width: `${warnPct}%` }}
          />
        )}
        {row.band_healthy_count > 0 && (
          <span
            className={classNames(classes.segment, classes.segmentHealthy)}
            style={{ width: `${healPct}%` }}
          />
        )}
      </div>
      <span className={classes.totalCell}>{row.total_count}</span>
    </>
  );
};

const HealthByGroup: FC = () => {
  const [groupBy, setGroupBy] = useState<HealthGroupBy>("tag");
  const query = useHealthSummaryByGroup(groupBy);
  const groups = query.data?.data.groups ?? [];

  return (
    <section className={classes.container}>
      <header className={classes.header}>
        <p className="p-heading--5 u-no-margin--bottom">Health by group</p>
        <div className={classes.selectGroup}>
          <label className={classes.selectLabel} htmlFor="health-group-by">
            Group by
          </label>
          <Select
            id="health-group-by"
            value={groupBy}
            options={GROUP_OPTIONS}
            onChange={(e) => {
              setGroupBy(e.target.value as HealthGroupBy);
            }}
          />
        </div>
      </header>
      {query.isLoading && (
        <div className={classes.empty}>Loading…</div>
      )}
      {!query.isLoading && groups.length === 0 && (
        <div className={classes.empty}>
          No groups to show for this dimension yet.
        </div>
      )}
      {!query.isLoading && groups.length > 0 && (
        <div className={classes.table}>
          <span className={classNames(classes.tableHeader, classes.groupLabel)}>
            {groupBy === "tag" ? "Tag" : "Distribution"}
          </span>
          <span className={classes.tableHeader}>Distribution</span>
          <span className={classNames(classes.tableHeader, classes.tableHeaderTotal)}>
            Total
          </span>
          {groups.map((row) => (
            <GroupRow key={row.group} row={row} groupBy={groupBy} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HealthByGroup;
