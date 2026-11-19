import type {
  ComputerHealthHistoryRow,
  FleetHealthHistoryRow,
  HealthHistoryFactor,
  HealthRuleHistoryRow,
} from "./types";

const MS_PER_DAY = 86_400_000;
const ISO_DATE_LENGTH = 10;
const DEFAULT_COMPARE_DAYS = 7;

/** Returns the UTC date of a moment as `YYYY-MM-DD`. */
export const toDay = (moment: Date): string =>
  moment.toISOString().slice(0, ISO_DATE_LENGTH);

/** Returns the day `amount` days after a `YYYY-MM-DD` day. */
export const addDays = (day: string, amount: number): string =>
  toDay(new Date(Date.parse(day) + amount * MS_PER_DAY));

/** Returns how many days `to` is after `from`. */
export const daysBetween = (from: string, to: string): number =>
  Math.round((Date.parse(to) - Date.parse(from)) / MS_PER_DAY);

/** Returns the `from` and `to` query parameters for the last `days` days. */
export const historyWindow = (
  days: number,
  today: Date = new Date(),
): { from: string; to: string } => {
  const to = toDay(today);
  return { from: addDays(to, -days), to };
};

/** Returns the newest row dated at or before `day`. */
const rowAtOrBefore = <T extends { date: string }>(
  rows: T[],
  day: string,
): T | undefined => rows.findLast(({ date }) => date <= day);

export interface ScoreChange {
  delta: number;
  // The day the latest row is compared with.
  since: string;
  // False when the rules or the engine changed between the two days.
  comparable: boolean;
}

/** Returns how the average score moved over the last `days` days of history. */
export const scoreChange = (
  rows: FleetHealthHistoryRow[],
  days = DEFAULT_COMPARE_DAYS,
): ScoreChange | null => {
  const latest = rows.at(-1);
  if (!latest) {
    return null;
  }
  const reference = rowAtOrBefore(rows, addDays(latest.date, -days));
  if (!reference) {
    return null;
  }
  return {
    delta: latest.average_score - reference.average_score,
    since: reference.date,
    comparable:
      latest.rules_version === reference.rules_version &&
      latest.engine_version === reference.engine_version,
  };
};

/** Returns, per rule, how its instance count moved over the last `days` days. */
export const ruleCountChanges = (
  fleetRows: FleetHealthHistoryRow[],
  ruleRows: HealthRuleHistoryRow[],
  days = DEFAULT_COMPARE_DAYS,
): Record<string, number> | null => {
  // A day counts only when it has a fleet row. On such a day a rule without
  // a row matched nothing.
  const latest = fleetRows.at(-1);
  if (!latest) {
    return null;
  }
  const reference = rowAtOrBefore(fleetRows, addDays(latest.date, -days));
  if (!reference) {
    return null;
  }
  const changes: Record<string, number> = {};
  for (const row of ruleRows) {
    if (row.date === latest.date) {
      changes[row.rule_key] = (changes[row.rule_key] ?? 0) + row.computer_count;
    } else if (row.date === reference.date) {
      changes[row.rule_key] = (changes[row.rule_key] ?? 0) - row.computer_count;
    }
  }
  return changes;
};

export interface MeasurementChange {
  date: string;
  label: string;
}

/** Returns the days on which the rules or the engine version changed. */
export const measurementChanges = (
  rows: { date: string; rules_version: number; engine_version?: number }[],
): MeasurementChange[] =>
  rows.flatMap((row, index) => {
    const previous = rows[index - 1];
    if (!previous) {
      return [];
    }
    if (row.rules_version !== previous.rules_version) {
      return [{ date: row.date, label: "Rules changed" }];
    }
    if (row.engine_version !== previous.engine_version) {
      return [{ date: row.date, label: "Scoring updated" }];
    }
    return [];
  });

export interface FactorChange {
  rule_key: string;
  kind: "added" | "removed" | "changed";
  // Points the rule cost before and after the change.
  from: number;
  to: number;
}

/** Returns the rules whose penalty differs between two history rows. */
export const factorChanges = (
  previous: Pick<ComputerHealthHistoryRow, "factors"> | null,
  next: Pick<ComputerHealthHistoryRow, "factors">,
): FactorChange[] => {
  const before = new Map<string, HealthHistoryFactor>(
    (previous?.factors ?? []).map((factor) => [factor.rule_key, factor]),
  );
  const changes: FactorChange[] = [];
  for (const factor of next.factors) {
    const old = before.get(factor.rule_key);
    before.delete(factor.rule_key);
    if (!old) {
      changes.push({
        rule_key: factor.rule_key,
        kind: "added",
        from: 0,
        to: factor.points,
      });
    } else if (old.points !== factor.points) {
      changes.push({
        rule_key: factor.rule_key,
        kind: "changed",
        from: old.points,
        to: factor.points,
      });
    }
  }
  for (const old of before.values()) {
    changes.push({
      rule_key: old.rule_key,
      kind: "removed",
      from: old.points,
      to: 0,
    });
  }
  return changes;
};
