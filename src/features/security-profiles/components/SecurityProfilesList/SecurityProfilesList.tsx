import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
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
            className="u-no-margin--bottom u-no-padding--top"
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
        Cell: ({ row }: CellProps<SecurityProfile>) => (
          <div>
            <div className={classes.textContainer}>
              <span>{row.original.last_run_results.passing} passed</span>
              <span>{row.original.last_run_results.failing} failed</span>
            </div>
            <div className={classes.lineContainer}>
              <div
                className={classes.linePassed}
                style={{
                  width: `${(row.original.last_run_results.passing / row.original.associated_instances) * 100}%`,
                }}
              />
              <div
                className={classes.lineFailed}
                style={{
                  width: `${(row.original.last_run_results.failing / row.original.associated_instances) * 100}%`,
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
              {row.original.associated_instances} instances
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
        Cell: ({ row }: CellProps<SecurityProfile>) => (
          <>
            <>
              {moment(row.original.last_run_results.timestamp).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
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
