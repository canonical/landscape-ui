import { ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { Column, CellProps } from "react-table";
import type { SecurityProfile } from "../../types";
import classes from "./SecurityProfilesList.module.scss";
import SecurityProfileListContextualMenu from "../SecurityProfilesContextualMenu";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import { Link } from "react-router";

interface SecurityProfilesListProps {
  readonly securityProfiles: SecurityProfile[];
}

const SecurityProfilesList: FC<SecurityProfilesListProps> = ({
  securityProfiles,
}) => {
  const columns = useMemo<Column<SecurityProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        className: classes.nameCell,
        Cell: ({ row }: CellProps<SecurityProfile>) => (
          <span>{row.original.name}</span>
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
        getCellIcon: ({ row: { original } }: CellProps<SecurityProfile>) => {
          if (original.status === "active") {
            return "status-succeeded-small";
          }
          if (original.status === "archived") {
            return "status-queued-small";
          }
        },
      },

      {
        accessor: "lastAuditPassrate",
        Header: "Last audit's passrate",
        Cell: ({ row }: CellProps<SecurityProfile>) => (
          <div>
            <div className={classes.textContainer}>
              <span>{row.original.lastAuditPassrate.passed} passed</span>
              <span>{row.original.lastAuditPassrate.failed} failed</span>
            </div>
            <div className={classes.lineContainer}>
              <div
                className={classes.linePassed}
                style={{
                  width: `${(row.original.lastAuditPassrate.passed / row.original.associatedInstances) * 100}%`,
                }}
              />
              <div
                className={classes.lineFailed}
                style={{
                  width: `${(row.original.lastAuditPassrate.failed / row.original.associatedInstances) * 100}%`,
                }}
              />
            </div>
          </div>
        ),
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
              {row.original.associatedInstances} instances
            </Link>

            <br />
            <span className={classes.elipsis}>
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
          } else if (row.original.mode === "restartFixAudit") {
            return "fix, restart, audit";
          } else if (row.original.mode === "fixAudit") {
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
        Cell: ({ row }: CellProps<SecurityProfile>) => (
          <>
            <>
              {moment(row.original.runs.last).format(DISPLAY_DATE_TIME_FORMAT)}
            </>
            <br />
            <span className={classes.elipsis}>{row.original.schedule}</span>
          </>
        ),
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
