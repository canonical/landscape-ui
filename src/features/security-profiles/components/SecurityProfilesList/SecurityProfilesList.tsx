import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { notifyCreation } from "../../helpers";
import type { SecurityProfile } from "../../types";
import SecurityProfileDetails from "../SecurityProfileDetails/SecurityProfileDetails";
import SecurityProfileForm from "../SecurityProfileForm";
import SecurityProfileListContextualMenu from "../SecurityProfilesContextualMenu";
import classes from "./SecurityProfilesList.module.scss";

interface SecurityProfilesListProps {
  readonly securityProfiles: SecurityProfile[];
}

const SecurityProfilesList: FC<SecurityProfilesListProps> = ({
  securityProfiles,
}) => {
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const actions = {
    duplicate: (profile: SecurityProfile) => {
      setSidePanelContent(
        `Duplicate ${profile.title}`,
        <SecurityProfileForm
          endDescription="To duplicate the profile, you need to run it."
          onSuccess={(values) => {
            notifyCreation(values, notify);
          }}
          profile={profile}
          submitButtonText="Duplicate"
        />,
      );
    },

    edit: (profile: SecurityProfile) => {
      setSidePanelContent(
        `Edit ${profile.title}`,
        <SecurityProfileForm
          benchmarkDisabled
          earlySubmit={(values) => values.mode == "audit"}
          endDescription="To save your changes, you need to run the profile."
          onSuccess={(values) => {
            notify.success({
              title: `You have successfully saved changes for ${values.title} security profile.`,
              message:
                values.mode == "audit"
                  ? "The changes applied will affect instances associated with this profile."
                  : values.mode == "fix-audit"
                    ? "The changes made will be applied after running the profile, which has been successfully initiated. It will apply remediation fixes on associated instances and generate an audit."
                    : "The changes made will be applied after running the profile, which has been successfully initiated. It will apply remediation fixes on associated instances, restart them, and generate an audit.",
            });
          }}
          profile={profile}
          submitButtonText="Save changes"
        />,
      );
    },
  };

  const columns = useMemo<Column<SecurityProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        className: classes.nameCell,
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => (
          <Button
            appearance="link"
            type="button"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              setSidePanelContent(
                profile.name,
                <SecurityProfileDetails actions={actions} profile={profile} />,
                "medium",
              );
            }}
          >
            {profile.name}
          </Button>
        ),
      },
      {
        accessor: "status",
        Header: "Status",
        className: classes.status,
        Cell: ({
          row: {
            original: { status },
          },
        }: CellProps<SecurityProfile>) => {
          if (status === "active") {
            return "Active";
          } else if (status === "archived") {
            return "Archived";
          } else {
            return status;
          }
        },
        getCellIcon: ({
          row: {
            original: { status },
          },
        }: CellProps<SecurityProfile>) => {
          if (status === "active") {
            return "status-succeeded-small";
          }
          if (status === "archived") {
            return "status-queued-small";
          }
        },
      },
      {
        accessor: "lastAuditPassrate",
        Header: "Last audit's passrate",
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => (
          <div>
            <div className={classes.textContainer}>
              <span>{profile.last_run_results.passing} passed</span>
              <span>{profile.last_run_results.failing} failed</span>
            </div>
            <div className={classes.lineContainer}>
              <div
                className={classes.linePassed}
                style={{
                  width: `${(profile.last_run_results.passing / profile.associated_instances) * 100}%`,
                }}
              />
              <div
                className={classes.lineFailed}
                style={{
                  width: `${(profile.last_run_results.failing / profile.associated_instances) * 100}%`,
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
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => (
          <>
            <Link
              to={{
                pathname: "/instances",
                search: `?tags=${profile.tags.join("%2C")}`,
              }}
            >
              {profile.associated_instances} instances
            </Link>

            <br />
            <span className={classes.elipsis}>
              {profile.tags ? profile.tags.join(", ") : profile.tags}
            </span>
          </>
        ),
      },
      {
        accessor: "mode",
        Header: "Profile Mode",
        Cell: ({
          row: {
            original: { mode },
          },
        }: CellProps<SecurityProfile>) => {
          if (mode === "audit") {
            return "audit only";
          } else if (mode === "fix-restart-audit") {
            return "fix, restart, audit";
          } else if (mode === "fix-audit") {
            return "fix and audit";
          } else {
            return mode;
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
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => (
          <>
            <>
              {moment(profile.last_run_results.timestamp).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            </>
            <br />
            <span className={classes.elipsis}>{profile.schedule}</span>
          </>
        ),
      },
      {
        accessor: "id",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => (
          <SecurityProfileListContextualMenu
            actions={actions}
            profile={profile}
          />
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
