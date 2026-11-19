// LA061 — fixture data for the Health history endpoints. Every series is
// derived from the active fleet fixture and ends on it, so the trend graphs
// agree with the live numbers next to them.

import type {
  ComputerHealthHistory,
  ComputerHealthHistoryRow,
  FleetHealthHistoryRow,
  HealthBand,
  HealthHistoryFactor,
  HealthRuleHistoryRow,
} from "@/features/health";
import { addDays, daysBetween, toDay } from "@/features/health";
import {
  RULES_VERSION,
  getComputerHealth,
  getHealthFixture,
  seededRules,
  thresholds,
} from "./health";

/* eslint-disable @typescript-eslint/no-magic-numbers --
 * The shape of a synthetic series: how long the feature has been on, when
 * the rules changed, when an incident dipped the fleet. Naming every literal
 * would only obscure the curve.
 */

// The feature was enabled this many days ago, so longer windows start empty.
export const HISTORY_DAYS = 75;
// The night the archive step did not run. The day has no row.
export const MISSED_DAY_AGO = 9;
// The rules changed this many days ago.
export const RULES_CHANGED_DAYS_AGO = 12;
const ENGINE_VERSION = 1;
const MAX_SCORE = 100;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

// A few bad days three weeks back, so the line is not a ramp.
const incident = (ago: number): number =>
  ago >= 18 && ago <= 23 ? 6 - Math.abs(ago - 20) * 2 : 0;

const wobble = (ago: number): number => (ago === 0 ? 0 : ((ago * 7) % 3) - 1);

const isArchived = (ago: number): boolean =>
  ago >= 0 && ago <= HISTORY_DAYS && ago !== MISSED_DAY_AGO;

const rulesVersionOn = (ago: number): number =>
  ago >= RULES_CHANGED_DAYS_AGO ? RULES_VERSION - 1 : RULES_VERSION;

// Days of the inclusive window, oldest first, with how long ago each was.
const daysOf = (
  from: string,
  to: string,
  today: string,
): { date: string; ago: number }[] => {
  const out: { date: string; ago: number }[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    out.push({ date, ago: daysBetween(date, today) });
  }
  return out;
};

export const getFleetHistory = (
  from: string,
  to: string,
  today = toDay(new Date()),
): FleetHealthHistoryRow[] => {
  const { summary } = getHealthFixture();
  if (summary.average_score === null) {
    return [];
  }
  const average = summary.average_score;
  const measured = summary.measured_count;
  return daysOf(from, to, today)
    .filter(({ ago }) => isArchived(ago))
    .map(({ date, ago }) => {
      // The old rules scored a little harsher, hence the step on that day.
      const oldRules = ago >= RULES_CHANGED_DAYS_AGO ? 3 : 0;
      const critical = clamp(
        summary.bands.critical + Math.round(ago / 8) + incident(ago),
        0,
        measured,
      );
      const warning = clamp(
        summary.bands.warning + Math.round(ago / 5),
        0,
        measured - critical,
      );
      return {
        date,
        bands: {
          critical,
          warning,
          healthy: measured - critical - warning,
          unmeasured: summary.bands.unmeasured,
        },
        measured_count: measured,
        average_score: clamp(
          average -
            Math.round(ago * 0.12) -
            incident(ago) -
            oldRules +
            wobble(ago),
          0,
          MAX_SCORE,
        ),
        rules_version: rulesVersionOn(ago),
        engine_version: ENGINE_VERSION,
      };
    });
};

// Instances a rule gains per day going back in time. A negative slope is a
// problem that has been growing.
const RULE_SLOPES = [0.3, -0.25, 0.15, -0.1, 0.05, 0];

export const getRuleHistory = (
  from: string,
  to: string,
  ruleKeys: string[] = [],
  today = toDay(new Date()),
): HealthRuleHistoryRow[] => {
  const { summary } = getHealthFixture();
  const issues = summary.top_issues.filter(
    ({ rule_key }) => ruleKeys.length === 0 || ruleKeys.includes(rule_key),
  );
  return daysOf(from, to, today)
    .filter(({ ago }) => isArchived(ago) && summary.average_score !== null)
    .flatMap(({ date, ago }) =>
      issues
        .map((issue): HealthRuleHistoryRow => {
          const slope =
            RULE_SLOPES[
              summary.top_issues.indexOf(issue) % RULE_SLOPES.length
            ] ?? 0;
          const computer_count = clamp(
            issue.computer_count + Math.round(ago * slope) + incident(ago),
            0,
            summary.measured_count,
          );
          return {
            date,
            rule_key: issue.rule_key,
            computer_count,
            points_sum: Math.round(
              (issue.points_sum / issue.computer_count) * computer_count,
            ),
            weight:
              seededRules.find((rule) => rule.rule_key === issue.rule_key)
                ?.weight ?? 0,
          };
        })
        .filter(({ computer_count }) => computer_count > 0)
        .sort((a, b) => a.rule_key.localeCompare(b.rule_key)),
    );
};

const bandOf = (score: number): HealthBand => {
  if (score <= thresholds.critical_max) return "critical";
  return score <= thresholds.warning_max ? "warning" : "healthy";
};

const UPDATES: HealthHistoryFactor = {
  rule_key: "package.updates_available",
  count: 4,
  points: 4,
};

// The instance's results, newest first, with how long ago each began. The
// newest is the live state; each earlier one differs by one rule.
const resultsOf = (
  computerId: number,
): { ago: number; score: number | null; factors: HealthHistoryFactor[] }[] => {
  const health = getComputerHealth(computerId);
  if (!health.measurable) {
    return [];
  }
  const current = health.factors.map(({ rule_key, count, points }) => ({
    rule_key,
    count,
    points,
  }));
  const states = [
    { ago: 2 + (computerId % 9), score: health.score, factors: current },
  ];
  // Before the costliest factor appeared.
  const costliest = current.toSorted((a, b) => b.points - a.points)[0];
  if (costliest) {
    const previous = states[0]!;
    states.push({
      ago: previous.ago + 6 + (computerId % 11),
      score: clamp(health.score + costliest.points, 0, MAX_SCORE),
      factors: current.filter((factor) => factor !== costliest),
    });
  }
  // Before that, pending updates were either there or not.
  const middle = states.at(-1)!;
  const updates = middle.factors.find(
    ({ rule_key }) => rule_key === UPDATES.rule_key,
  );
  states.push({
    ago: middle.ago + 10 + (computerId % 17),
    score: clamp(
      middle.score + (updates ? updates.points : -UPDATES.points),
      0,
      MAX_SCORE,
    ),
    factors: updates
      ? middle.factors.filter((factor) => factor !== updates)
      : [...middle.factors, UPDATES],
  });
  return states.filter(({ ago }) => ago <= HISTORY_DAYS);
};

export const getComputerHistory = (
  computerId: number,
  from: string,
  to: string,
  today = toDay(new Date()),
): ComputerHealthHistory => {
  const rows = resultsOf(computerId)
    .map(({ ago, score, factors }): ComputerHealthHistoryRow => ({
      date: addDays(today, -ago),
      score,
      band: score === null ? null : bandOf(score),
      critical_factor_count: factors.filter(({ points }) => points >= 100)
        .length,
      rules_version: rulesVersionOn(ago),
      factors,
    }))
    .reverse();
  return {
    baseline: rows.findLast(({ date }) => date < from) ?? null,
    results: rows.filter(({ date }) => date >= from && date <= to),
  };
};
/* eslint-enable @typescript-eslint/no-magic-numbers */
