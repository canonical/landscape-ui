import NoData from "@/components/layout/NoData";
import { ROUTES } from "@/libs/routes";
import { Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import { Link } from "react-router";
import classes from "./USGProfileAuditPassRate.module.scss";
import type { USGProfile } from "../../types";

interface USGProfileAuditPassRateProps {
  readonly profile: USGProfile;
}

const USGProfileAuditPassRate: FC<USGProfileAuditPassRateProps> = ({
  profile,
}) => {
  const { passing, failing, in_progress, not_started } =
    profile.last_run_results;
  const total = passing + failing + in_progress + not_started;

  if (!total) {
    return <NoData />;
  }

  const passingPercent = ((passing / total) * 100).toFixed(0);
  const failingPercent = ((failing / total) * 100).toFixed(0);
  const inProgressPercent = ((in_progress / total) * 100).toFixed(0);
  const notRunPercent = ((not_started / total) * 100).toFixed(0);

  const totalPercent =
    parseInt(passingPercent) +
    parseInt(failingPercent) +
    parseInt(inProgressPercent) +
    parseInt(notRunPercent);
  const difference = 100 - totalPercent;

  const adjustedPassingPercent = (
    parseInt(passingPercent) + difference
  ).toString();

  const tooltipMessage = (
    <>
      <div>
        <div>
          <strong>Passed:</strong>{" "}
          {`${passing} instances (${adjustedPassingPercent}%)`}
        </div>
        <div>
          <strong>Failed:</strong> {`${failing} instances (${failingPercent}%)`}
        </div>
        <div>
          <strong>In progress:</strong>{" "}
          {`${in_progress} instances (${inProgressPercent}%)`}
        </div>
        <div>
          <strong>Not run:</strong>{" "}
          {`${not_started} instances (${notRunPercent}%)`}
        </div>
      </div>
    </>
  );

  return (
    <div>
      <div className={classes.textContainer}>
        <div>
          {passing > 0 ? (
            <Link
              to={ROUTES.instances.root({
                query: `usg-profile:${profile.id}:pass`,
              })}
            >
              <span>{passing} passed</span>
            </Link>
          ) : (
            <span>{passing} passed</span>
          )}
        </div>
        {failing > 0 ? (
          <Link
            to={ROUTES.instances.root({
              query: `usg-profile:${profile.id}:fail`,
            })}
          >
            <span>{failing} failed</span>
          </Link>
        ) : (
          <span>{failing} failed</span>
        )}
      </div>

      <Tooltip
        position="btm-center"
        positionElementClassName={classes.tooltip}
        message={tooltipMessage}
      >
        <div className={classes.lineContainer} data-testid="passrate-line">
          {passing > 0 && (
            <div
              className={classes.linePassed}
              style={{ width: `${(passing / total) * 100}%` }}
            />
          )}
          {failing > 0 && (
            <div
              className={classes.lineFailed}
              style={{ width: `${(failing / total) * 100}%` }}
            />
          )}
          {in_progress > 0 && (
            <div
              className={classes.lineInProgress}
              style={{ width: `${(in_progress / total) * 100}%` }}
            />
          )}
          {not_started > 0 && (
            <div
              className={classes.lineNotRun}
              style={{ width: `${(not_started / total) * 100}%` }}
            />
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export default USGProfileAuditPassRate;
