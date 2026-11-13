import { Meter } from "@/components/ui";
import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { BAND_CRITICALITY, BAND_ICON, BAND_LABEL } from "../../helpers";
import type { HealthBand } from "../../types";
import classes from "./HealthScoreSummary.module.scss";

interface HealthScoreSummaryProps {
  readonly score: number;
  readonly band: HealthBand;
  readonly label?: string;
  readonly hint?: ReactNode;
  readonly className?: string;
}

/** Returns a headline health score with its band, a meter and a hint. */
const HealthScoreSummary: FC<HealthScoreSummaryProps> = ({
  score,
  band,
  label = "Health score",
  hint,
  className,
}) => (
  <div className={classNames(classes.root, className)}>
    <p className={classes.line}>
      <span className={classes.value}>{score}</span>
      <span className={classes.max}>/ 100</span>
      <span className={classNames(classes.band, BAND_CRITICALITY[band])}>
        <Icon name={BAND_ICON[band]} />
        {BAND_LABEL[band]}
      </span>
    </p>
    <Meter
      value={score}
      criticality={BAND_CRITICALITY[band]}
      aria-label={`${label} ${score} of 100, ${BAND_LABEL[band]}`}
    />
    {hint ? <p className={classes.hint}>{hint}</p> : null}
  </div>
);

export default HealthScoreSummary;
