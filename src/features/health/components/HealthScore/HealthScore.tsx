import { Meter } from "@/components/ui";
import classNames from "classnames";
import type { FC } from "react";
import { BAND_CRITICALITY, BAND_LABEL } from "../../helpers";
import type { HealthBand } from "../../types";
import classes from "./HealthScore.module.scss";

interface HealthScoreProps {
  readonly score: number;
  readonly band: HealthBand;
  readonly className?: string;
}

/** Returns a health score as a numeral in its band color beside a meter. */
const HealthScore: FC<HealthScoreProps> = ({ score, band, className }) => (
  <span className={classNames(classes.root, BAND_CRITICALITY[band], className)}>
    <span className={classes.value} aria-hidden="true">
      {score}
    </span>
    <Meter
      value={score}
      criticality={BAND_CRITICALITY[band]}
      aria-label={`Health score ${score} out of 100, ${BAND_LABEL[band]}`}
    />
  </span>
);

export default HealthScore;
