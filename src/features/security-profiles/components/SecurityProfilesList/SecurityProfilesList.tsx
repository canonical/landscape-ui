import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable, Tooltip } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import type { SecurityProfile } from "../../types";
import SecurityProfileDetails from "../SecurityProfileDetails/SecurityProfileDetails";
import SecurityProfileListContextualMenu from "../SecurityProfilesContextualMenu";
import classes from "./SecurityProfilesList.module.scss";

interface SecurityProfilesListProps {
  readonly securityProfiles: SecurityProfile[];
}

const SecurityProfilesList: FC<SecurityProfilesListProps> = ({
  securityProfiles,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const columns = useMemo<Column<SecurityProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        className: classes.nameCell,
        Cell: ({ row }: CellProps<SecurityProfile>) => (
          <Button
            appearance="link"
            type="button"
            className={`${classes.ellipsisButton} u-no-margin--bottom u-no-padding--top`}
            onClick={() => {
              setSidePanelContent(
                row.original.name,
                <SecurityProfileDetails profile={row.original} />,
                "medium",
              );
            }}
          >
            {row.original.name}
          </Button>
        ),
      },
      {
        accessor: "status",
        Header: "Status",
        className: classes.status,
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          if (row.original.status === "active") {
            return "Active";
          } else if (row.original.status === "archived") {
            return "Archived";
          } else {
            return row.original.status;
          }
        },
        getCellIcon: ({ row }: CellProps<SecurityProfile>) => {
          if (row.original.status === "active") {
            return "status-succeeded-small";
          }
          if (row.original.status === "archived") {
            return "status-queued-small";
          }
        },
      },
      {
        accessor: "lastAuditPassrate",
        Header: "Last audit's passrate",
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          const { passing, failing, in_progress } =
            row.original.last_run_results;
          const total = row.original.associated_instances;

          const notRun = total - (passing + failing + in_progress);

          // Calculate raw percentages without casting to number
          const passingPercent = ((passing / total) * 100).toFixed(0);
          const failingPercent = ((failing / total) * 100).toFixed(0);
          const inProgressPercent = ((in_progress / total) * 100).toFixed(0);
          const notRunPercent = ((notRun / total) * 100).toFixed(0);

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
                <strong>Passed:</strong> {passing} instances (
                {adjustedPassingPercent}%)
              </div>
              <div>
                <strong>Failed:</strong> {failing} instances ({failingPercent}%)
              </div>
              <div>
                <strong>In progress:</strong> {in_progress} instances (
                {inProgressPercent}%)
              </div>
              <div>
                <strong>Not Run:</strong> {notRun} instances ({notRunPercent}%)
              </div>
            </>
          );

          return (
            <div>
              <div className={classes.textContainer}>
                <span>{passing} passed</span>
                <span>{failing} failed</span>
              </div>
              <Tooltip
                positionElementClassName={classes.tooltip}
                message={tooltipMessage}
              >
                <div className={classes.lineContainer}>
                  <div
                    className={classes.linePassed}
                    style={{ width: `${(passing / total) * 100}%` }}
                  />
                  <div
                    className={classes.lineFailed}
                    style={{ width: `${(failing / total) * 100}%` }}
                  />
                  <div
                    className={classes.lineInProgress}
                    style={{ width: `${(in_progress / total) * 100}%` }}
                  />
                </div>
              </Tooltip>
            </div>
          );
        },
      },

      {
        accessor: "associatedInstances",
        Header: () => (
          <span>
            Associated instances
            <br />
            Tags
          </span>
        ),
        Cell: ({ row }: CellProps<SecurityProfile>) => (
          <>
            <Link
              to={{
                pathname: "/instances",
                search: `?tags=${row.original.tags.join("%2C")}`,
              }}
            >
              {row.original.associated_instances} instances
            </Link>

            <br />
            <span className={classes.ellipsis}>
              {row.original.tags
                ? row.original.tags.join(", ")
                : row.original.tags}
            </span>
          </>
        ),
      },
      {
        accessor: "mode",
        Header: "Profile Mode",
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          if (row.original.mode === "audit") {
            return "audit only";
          } else if (row.original.mode === "fix-restart-audit") {
            return "fix, restart, audit";
          } else if (row.original.mode === "fix-audit") {
            return "fix and audit";
          } else {
            return row.original.mode;
          }
        },
      },
      {
        accessor: "schedule",
        Header: () => (
          <span>
            Last run
            <br />
            Schedule
          </span>
        ),
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          const lastRun = moment(
            row.original.last_run_results.timestamp,
          ).format(DISPLAY_DATE_TIME_FORMAT);
          const nextRun = moment(row.original.next_run_time).format(
            DISPLAY_DATE_TIME_FORMAT,
          );
          const { schedule } = row.original;

          const tooltipMessage = (
            <>
              <div>
                <strong>Last run:</strong> {lastRun} GMT
              </div>
              <div>
                <strong>Next run:</strong> {nextRun} GMT
              </div>
              <div>
                <strong>Schedule:</strong> {schedule}
              </div>
            </>
          );

          return (
            <Tooltip
              positionElementClassName={classes.tooltip}
              message={tooltipMessage}
            >
              <div>
                {lastRun}
                <br />
                <span className={classes.ellipsis}>{schedule}</span>
              </div>
            </Tooltip>
          );
        },
      },
      {
        accessor: "id",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row }: CellProps<SecurityProfile>) => (
          <SecurityProfileListContextualMenu profile={row.original} />
        ),
      },
    ],
    [securityProfiles],
  );

  return (
    <>
      <ModularTable
        emptyMsg="No security profiles found according to your search parameters."
        columns={columns}
        data={securityProfiles}
      />
    </>
  );
};

export default SecurityProfilesList;
