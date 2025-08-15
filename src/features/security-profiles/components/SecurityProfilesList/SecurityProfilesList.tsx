import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ListTitle, {
  LIST_TITLE_COLUMN_PROPS,
} from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import { Button, Tooltip } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { SECURITY_PROFILE_MODE_LABELS } from "../../constants";
import { getSchedule, getStatus, getTags } from "../../helpers";
import type { SecurityProfile } from "../../types";
import SecurityProfileAssociatedInstancesLink from "../SecurityProfileAssociatedInstancesLink";
import SecurityProfileListActions from "../SecurityProfileListActions";
import classes from "./SecurityProfilesList.module.scss";

const ASSOCIATED_INSTANCES_HEADER = (
  <div className={classes.header}>
    Associated instances
    <span className="u-text--muted">Tags</span>
  </div>
);

const LAST_RUN_HEADER = (
  <div className={classes.header}>
    Last run
    <span className="u-text--muted">Schedule</span>
  </div>
);

interface SecurityProfilesListProps {
  readonly securityProfiles: SecurityProfile[];
}

const SecurityProfilesList: FC<SecurityProfilesListProps> = ({
  securityProfiles,
}) => {
  const { setPageParams } = usePageParams();

  const columns = useMemo<Column<SecurityProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => {
          return (
            <ListTitle>
              <Button
                appearance="link"
                type="button"
                className="u-no-margin--bottom u-no-padding--top u-align--left"
                onClick={() => {
                  setPageParams({
                    action: "view",
                    securityProfile: profile.id,
                  });
                }}
              >
                {profile.title}
              </Button>

              <span className="u-text--muted">{profile.name}</span>
            </ListTitle>
          );
        },
      },
      {
        accessor: "status",
        Header: "Status",
        className: classes.status,
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) =>
          getStatus(profile).label,
        getCellIcon: ({
          row: { original: profile },
        }: CellProps<SecurityProfile>) => getStatus(profile).icon,
      },
      {
        accessor: "lastAuditPassrate",
        Header: "Last audit's pass rate",
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          const { passing, failing, in_progress, not_started } =
            row.original.last_run_results;
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
                  <strong>Failed:</strong>{" "}
                  {`${failing} instances (${failingPercent}%)`}
                </div>
                <div>
                  <strong>In progress:</strong>{" "}
                  {`${in_progress} instances (${inProgressPercent}%)`}
                </div>
                <div>
                  <strong>Not Run:</strong>{" "}
                  {`${not_started} instances (${notRunPercent}%)`}
                </div>
              </div>
            </>
          );

          return (
            <>
              <div className={classes.textContainer}>
                <div>
                  {passing > 0 ? (
                    <Link
                      to={{
                        pathname: "/instances",
                        search: `?query=security-profile%3A${row.original.id}%3Apass`,
                      }}
                    >
                      <span>{passing} passed</span>
                    </Link>
                  ) : (
                    <span>{passing} passed</span>
                  )}
                </div>
                {failing > 0 ? (
                  <Link
                    to={{
                      pathname: "/instances",
                      search: `?query=security-profile%3A${row.original.id}%3Afail`,
                    }}
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
                <div className={classes.lineContainer}>
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
            </>
          );
        },
      },
      {
        accessor: "associatedInstances",
        Header: ASSOCIATED_INSTANCES_HEADER,
        className: classes.associatedInstances,

        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => (
          <>
            <div className={classes.ellipsis}>
              <SecurityProfileAssociatedInstancesLink
                securityProfile={profile}
              />
              <br />
              {getTags(profile)}
            </div>
          </>
        ),
      },
      {
        accessor: "mode",
        Header: "Mode",
        className: classes.mode,
        Cell: ({
          row: {
            original: { mode },
          },
        }: CellProps<SecurityProfile>) => SECURITY_PROFILE_MODE_LABELS[mode],
      },
      {
        accessor: "schedule",
        Header: LAST_RUN_HEADER,
        className: "date-cell",
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          const lastRun = !row.original.last_run_results.timestamp ? (
            <NoData />
          ) : (
            moment(row.original.last_run_results.timestamp).format(
              DISPLAY_DATE_TIME_FORMAT,
            )
          );
          const nextRun = !row.original.next_run_time ? (
            <NoData />
          ) : (
            moment(row.original.next_run_time).format(DISPLAY_DATE_TIME_FORMAT)
          );

          const tooltipMessage = (
            <>
              <div>
                <strong>Last run:</strong> {lastRun}
                {!lastRun ? " GMT" : ""}
              </div>
              <div>
                <strong>Next run:</strong> {nextRun}
                {!nextRun ? " GMT" : ""}
              </div>
              <div>
                <strong>Schedule:</strong> {getSchedule(row.original)}
              </div>
            </>
          );

          return (
            <Tooltip
              position="top-center"
              positionElementClassName={classes.tooltip}
              message={tooltipMessage}
            >
              <div className={classes.truncated}>
                <span className="font-monospace">{lastRun}</span>
                <br />
                <span className={classes.ellipsis}>
                  {getSchedule(row.original)}
                </span>
              </div>
            </Tooltip>
          );
        },
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => (
          <SecurityProfileListActions profile={profile} />
        ),
      },
    ],
    [],
  );

  return (
    <ResponsiveTable
      emptyMsg="No security profiles found according to your search parameters."
      columns={columns}
      data={securityProfiles}
      minWidth={1200}
    />
  );
};

export default SecurityProfilesList;
