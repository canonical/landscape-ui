import InteractiveTooltip from "@/components/layout/InteractiveTooltip";
import { Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import {
  BAND_LABEL,
  CRITICAL_SCORE_CEILING,
  HEALTHY_SCORE_FLOOR,
} from "../../helpers";
import classes from "./HealthScoreInfo.module.scss";

/** Returns an info trigger that explains how a health score is calculated. */
const HealthScoreInfo: FC = () => (
  <InteractiveTooltip
    className={classes.info}
    triggerClassName={classes.trigger}
    tooltipClassName={classes.message}
    label="How the health score is calculated"
    message={
      <>
        Every instance starts at 100. Each rule it matches subtracts its points,
        and the score never goes below 0.
        <br />
        A critical rule sets the score to 0 on its own.
        <br />
        {BAND_LABEL.critical}: 0 to {CRITICAL_SCORE_CEILING}.{" "}
        {BAND_LABEL.warning}: {CRITICAL_SCORE_CEILING + 1} to{" "}
        {HEALTHY_SCORE_FLOOR - 1}. {BAND_LABEL.healthy}: {HEALTHY_SCORE_FLOOR}{" "}
        to 100.
      </>
    }
  >
    <Icon name={ICONS.information} aria-hidden />
  </InteractiveTooltip>
);

export default HealthScoreInfo;
