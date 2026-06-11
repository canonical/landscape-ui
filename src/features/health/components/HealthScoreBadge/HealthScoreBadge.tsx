import classNames from "classnames";
import type { FC } from "react";
import type { HealthBand } from "../../types";
import classes from "./HealthScoreBadge.module.scss";

interface HealthScoreBadgeProps {
  readonly score: number;
  readonly band: HealthBand;
  readonly className?: string;
}

// Small band-tinted chip designed to drop in next to a label exactly like
// `Badge` from `@canonical/react-components` (matching `p-badge` shape and
// spacing). Vanilla's stock Badge only ships default and negative
// variants; we need three, so this stays local to the health feature.
const HealthScoreBadge: FC<HealthScoreBadgeProps> = ({
  score,
  band,
  className,
}) => (
  <span
    className={classNames(classes.badge, classes[`band_${band}`], className)}
    aria-label={`Health score ${score}`}
  >
    {score}
  </span>
);

export default HealthScoreBadge;
