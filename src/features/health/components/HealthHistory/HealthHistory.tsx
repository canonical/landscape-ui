import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import date from "@/libs/date";
import { Card } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { FC } from "react";
import { useId, useState } from "react";
import { BAND_CRITICALITY } from "../../helpers";
import type { FactorChange } from "../../history";
import { factorChanges, historyWindow } from "../../history";
import useComputerHealthHistory from "../../hooks/useComputerHealthHistory";
import useHealthRules from "../../hooks/useHealthRules";
import type { ComputerHealthHistoryRow, HealthHistoryRange } from "../../types";
import HealthHistoryRangeSwitch from "../HealthHistoryRange";
import HealthTrendChart from "../HealthTrendChart";
import classes from "./HealthHistory.module.scss";

const DEFAULT_RANGE: HealthHistoryRange = 30;

interface HealthHistoryProps {
  readonly computerId: number;
  readonly className?: string;
}

const formatDay = (day: string): string =>
  date(day).format(DISPLAY_DATE_FORMAT);

const Score: FC<{ readonly row: ComputerHealthHistoryRow }> = ({ row }) =>
  row.score === null || row.band === null ? (
    <span className="u-text--muted">Not measured</span>
  ) : (
    <strong className={classNames(classes.score, BAND_CRITICALITY[row.band])}>
      {row.score}
    </strong>
  );

const HealthHistory: FC<HealthHistoryProps> = ({ computerId, className }) => {
  const titleId = useId();
  const [range, setRange] = useState<HealthHistoryRange>(DEFAULT_RANGE);
  const query = useComputerHealthHistory(computerId, range);
  const rulesQuery = useHealthRules();
  const { from, to } = historyWindow(range);

  const baseline = query.data?.data.baseline ?? null;
  const results = query.data?.data.results ?? [];
  const hasHistory = baseline !== null || results.length > 0;

  const titles = new Map(
    (rulesQuery.data?.data.results ?? []).map((rule) => [
      rule.rule_key,
      rule.title,
    ]),
  );

  const describe = ({
    rule_key,
    kind,
    from: before,
    to: after,
  }: FactorChange) => {
    const title = titles.get(rule_key) || rule_key;
    if (kind === "added") {
      return `${title} appeared (−${after})`;
    }
    if (kind === "removed") {
      return `${title} cleared (+${before})`;
    }
    return `${title} went from −${before} to −${after}`;
  };

  // A history row is written when the result changes, which can be days after
  // the rules did, so the graph carries no rule-change marker.
  // The baseline holds from the start of the window until the first change.
  const points = [
    ...(baseline ? [{ date: from, value: baseline.score }] : []),
    ...results.map((row) => ({ date: row.date, value: row.score })),
  ];
  const changes = results
    .map((row, index) => ({
      row,
      previous: results[index - 1] ?? baseline,
    }))
    .reverse();

  return (
    <Card className={className} aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="p-heading--5 u-no-margin u-no-padding">
          Score history
        </h2>
        <HealthHistoryRangeSwitch
          value={range}
          onChange={setRange}
          label="Score history range"
        />
      </Card.Header>
      <Card.Content>
        {query.isLoading ? <LoadingState /> : null}
        {query.isError ? (
          <p className={classes.message}>
            The score history could not be loaded.
          </p>
        ) : null}
        {query.isSuccess && !hasHistory ? (
          <p className={classes.message}>
            No history yet. A change is recorded the night after the score
            moves.
          </p>
        ) : null}
        {hasHistory ? (
          <div className={classes.body}>
            <HealthTrendChart
              points={points}
              from={from}
              to={to}
              variant="step"
              valueLabel="Score"
            />
            {changes.length === 0 && baseline ? (
              <p className={classes.message}>
                No change in this period. The score has been{" "}
                <Score row={baseline} /> since {formatDay(baseline.date)}.
              </p>
            ) : (
              <ol className={classes.list} aria-label="Score changes">
                {changes.map(({ row, previous }) => {
                  const reasons = factorChanges(previous, row);
                  return (
                    <li key={row.date} className={classes.item}>
                      <time dateTime={row.date} className={classes.date}>
                        {formatDay(row.date)}
                      </time>
                      <span className={classes.scores}>
                        {previous ? (
                          <>
                            <Score row={previous} />
                            <span aria-hidden="true"> → </span>
                            <span className="u-off-screen"> to </span>
                          </>
                        ) : null}
                        <Score row={row} />
                      </span>
                      <span className={classes.reasons}>
                        {previous ? null : "First recorded score."}
                        {row.score === null
                          ? "The instance stopped being measured."
                          : null}
                        {previous && row.score !== null
                          ? reasons.map(describe).join(", ")
                          : null}
                        {previous &&
                        row.rules_version !== previous.rules_version
                          ? `${reasons.length > 0 ? ". " : ""}The rules also changed since the previous entry.`
                          : null}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ) : null}
      </Card.Content>
    </Card>
  );
};

export default HealthHistory;
