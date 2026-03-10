import NoData from "@/components/layout/NoData";
import { Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import type { SecurityProfile } from "../../types";
import classes from "./SecurityProfileLastRunWithSchedule.module.scss";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { getSchedule } from "../../helpers";

interface SecurityProfileLastRunWithScheduleProps {
  readonly profile: SecurityProfile;
}

const SecurityProfileLastRunWithSchedule: FC<SecurityProfileLastRunWithScheduleProps> = ({
  profile
}) => {
  const lastRun = !profile.last_run_results.timestamp ? (
        <NoData />
      ) : (
        moment(profile.last_run_results.timestamp)
          .format(DISPLAY_DATE_TIME_FORMAT)
      );
      const nextRun = !profile.next_run_time ? (
        <NoData />
      ) : (
        moment(profile.next_run_time).format(DISPLAY_DATE_TIME_FORMAT)
      );

      return (
        <Tooltip
          position="top-center"
          positionElementClassName={classes.tooltip}
          message={<><strong>Next run:</strong> {nextRun}</>}
        >
          <div className={classes.truncated}>
            <span
              aria-label={`Last run for ${profile.title} profile`}
            >
              {lastRun}
            </span>
            <br />
            <span
              className={classes.ellipsis}
              aria-label={`Schedule for ${profile.title} profile`}
            >
              {getSchedule(profile)}
            </span>
          </div>
        </Tooltip>
      );
};

export default SecurityProfileLastRunWithSchedule;
