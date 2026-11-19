import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import date from "@/libs/date";
import { pluralize } from "@/utils/_helpers";
import { Card } from "@canonical/react-ds-global";
import type { FC } from "react";
import { useId, useState } from "react";
import { historyWindow, measurementChanges, scoreChange } from "../../history";
import useFleetHealthHistory from "../../hooks/useFleetHealthHistory";
import type { FleetHealthThresholds, HealthHistoryRange } from "../../types";
import HealthHistoryRangeSwitch from "../HealthHistoryRange";
import HealthTrendChart from "../HealthTrendChart";
import classes from "./FleetHealthTrend.module.scss";

const DEFAULT_RANGE: HealthHistoryRange = 30;

interface FleetHealthTrendProps {
  readonly thresholds?: FleetHealthThresholds;
  readonly className?: string;
}

const FleetHealthTrend: FC<FleetHealthTrendProps> = ({
  thresholds,
  className,
}) => {
  const titleId = useId();
  const [range, setRange] = useState<HealthHistoryRange>(DEFAULT_RANGE);
  const query = useFleetHealthHistory(range);
  const { from, to } = historyWindow(range);
  const rows = query.data?.data.results ?? [];
  const change = scoreChange(rows);

  const renderChange = () => {
    if (!change) {
      return null;
    }
    const points = Math.abs(change.delta);
    const since = date(change.since).format(DISPLAY_DATE_FORMAT);
    return (
      <p className={classes.change}>
        {change.delta === 0 ? (
          <>
            <strong>No change</strong> since {since}
          </>
        ) : (
          <>
            <strong>
              {change.delta > 0 ? "Up" : "Down"} {points}{" "}
              {pluralize(points, ["point"])}
            </strong>{" "}
            since {since}
          </>
        )}
        {change.comparable
          ? null
          : ". The rules changed in between, so the two days were not scored the same way."}
      </p>
    );
  };

  return (
    <Card className={className} aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="p-heading--5 u-no-margin u-no-padding">
          Average health score over time
        </h2>
        <HealthHistoryRangeSwitch
          value={range}
          onChange={setRange}
          label="Fleet health history range"
        />
      </Card.Header>
      <Card.Content>
        {query.isLoading ? <LoadingState /> : null}
        {query.isError ? (
          <p className={classes.message}>
            The fleet health history could not be loaded.
          </p>
        ) : null}
        {query.isSuccess && rows.length === 0 ? (
          <p className={classes.message}>
            No history yet. A point is recorded each night once the fleet has
            been scored.
          </p>
        ) : null}
        {rows.length > 0 ? (
          <div className={classes.body}>
            {renderChange()}
            <HealthTrendChart
              points={rows.map((row) => ({
                date: row.date,
                value: row.average_score,
              }))}
              from={from}
              to={to}
              markers={measurementChanges(rows)}
              thresholds={thresholds}
              fitToValues
              valueLabel="Average score"
            />
          </div>
        ) : null}
      </Card.Content>
    </Card>
  );
};

export default FleetHealthTrend;
