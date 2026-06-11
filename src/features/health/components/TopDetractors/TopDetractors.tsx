// LA061 Phase 1.8: Top Detractors widget — top-5 worst instances by
// (score ASC, critical_factor_count DESC) with their dominant factor and a
// direct link to instance detail. Reuses the already-shipped
// `?ordering=score_asc&with_health=true&health_band=critical,warning` query
// on /api/v2/computers.

import { useGetInstances } from "@/features/instances/api/useGetInstances";
import classNames from "classnames";
import type { FC } from "react";
import { Link } from "react-router";
import type { Instance } from "@/types/Instance";
import classes from "./TopDetractors.module.scss";

const TOP_N = 5;

interface DominantFactor {
  description: string;
  points: number;
}

const dominantFactor = (instance: Instance): DominantFactor | null => {
  const factors = instance.health?.factors ?? [];
  if (factors.length === 0) return null;
  // Engine output is already sorted by penalty within `factors`, but be
  // defensive in case ordering changes: pick the factor with the highest
  // points value.
  let worst = factors[0]!;
  for (const f of factors) {
    if (f.points > worst.points) worst = f;
  }
  return { description: worst.description, points: worst.points };
};

const TopDetractors: FC = () => {
  const query = useGetInstances({
    limit: 25,
    health_band: "critical,warning",
    with_health: true,
  });
  const sorted = (query.instances ?? [])
    .filter((i) => i.health !== undefined)
    .slice()
    .sort((a, b) => {
      const aScore = a.health?.score ?? 100;
      const bScore = b.health?.score ?? 100;
      if (aScore !== bScore) return aScore - bScore;
      const aCrit = a.health?.critical_factor_count ?? 0;
      const bCrit = b.health?.critical_factor_count ?? 0;
      return bCrit - aCrit;
    })
    .slice(0, TOP_N);

  return (
    <section className={classes.container}>
      <header className={classes.header}>
        <p className="p-heading--5 u-no-margin--bottom">Top detractors</p>
        <p className={classes.subtitle}>Worst instances right now</p>
      </header>
      {query.isGettingInstances && (
        <div className={classes.empty}>Loading…</div>
      )}
      {!query.isGettingInstances && sorted.length === 0 && (
        <div className={classes.empty}>
          No instances in the warning or critical band — fleet is in good shape.
        </div>
      )}
      {!query.isGettingInstances && sorted.length > 0 && (
        <div className={classes.list}>
          {sorted.map((instance) => {
            const band = instance.health?.band ?? "healthy";
            const score = instance.health?.score ?? 100;
            const factor = dominantFactor(instance);
            const scoreClass =
              band === "critical"
                ? classes.scoreCritical
                : band === "warning"
                  ? classes.scoreWarning
                  : classes.scoreHealthy;
            return (
              <FragmentRow
                key={instance.id}
                instance={instance}
                score={score}
                scoreClass={scoreClass}
                factor={factor}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

interface FragmentRowProps {
  readonly instance: Instance;
  readonly score: number;
  readonly scoreClass: string;
  readonly factor: DominantFactor | null;
}

const FragmentRow: FC<FragmentRowProps> = ({
  instance,
  score,
  scoreClass,
  factor,
}) => (
  <>
    <span
      className={classNames(classes.scoreBadge, scoreClass)}
      aria-label={`Score ${score} out of 100`}
    >
      {score}
    </span>
    <Link className={classes.nameCell} to={`/instances/${instance.id}`}>
      {instance.title || `Instance ${instance.id}`}
    </Link>
    <span className={classes.factor}>
      {factor ? `${factor.description} (−${factor.points})` : "—"}
    </span>
  </>
);

export default TopDetractors;
