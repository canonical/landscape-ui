import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable, Tooltip } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { useAddSecurityProfile, useRunSecurityProfile } from "../../api";
import { useUpdateSecurityProfile } from "../../api/useUpdateSecurityProfile";
import { notifyCreation } from "../../helpers";
import type { SecurityProfile, SecurityProfileActions } from "../../types";
import SecurityProfileListContextualMenu from "../SecurityProfilesContextualMenu";
import classes from "./SecurityProfilesList.module.scss";
import { useActivities } from "@/features/activities";
import { getNotificationMessage } from "./helpers";
import useDebug from "@/hooks/useDebug";

const SecurityProfileRunFixForm = lazy(
  async () => import("../SecurityProfileRunFixForm"),
);

const SecurityProfileDetails = lazy(
  async () => import("../SecurityProfileDetails"),
);

const SecurityProfileDownloadAuditForm = lazy(
  async () => import("../SecurityProfileDownloadAuditForm"),
);

const SecurityProfileForm = lazy(async () => import("../SecurityProfileForm"));

interface SecurityProfilesListProps {
  readonly securityProfiles: SecurityProfile[];
}

const SecurityProfilesList: FC<SecurityProfilesListProps> = ({
  securityProfiles,
}) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const { openActivityDetails } = useActivities();

  const { addSecurityProfile, isSecurityProfileAdding } =
    useAddSecurityProfile();
  const { updateSecurityProfile, isSecurityProfileUpdating } =
    useUpdateSecurityProfile();
  const { runSecurityProfile } = useRunSecurityProfile();

  const handleRunSecurityProfile = async (profile: SecurityProfile) => {
    try {
      const { data: activity } = await runSecurityProfile({ id: profile.id });

      if (profile.mode.includes("fix")) {
        closeSidePanel();
      }

      const message = getNotificationMessage(profile.mode);

      notify.success({
        title: `You have successfully initiated Run of the ${profile.name} Security profile`,
        message,
        actions: [
          {
            label: "View details",
            onClick: () => {
              openActivityDetails(activity);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  const actions = (profile: SecurityProfile): SecurityProfileActions => ({
    downloadAudit: () => {
      setSidePanelContent(
        `Download audit for ${profile.title} security profile`,
        <Suspense fallback={<LoadingState />}>
          <SecurityProfileDownloadAuditForm profileId={profile.id} />
        </Suspense>,
      );
    },

    duplicate: () => {
      setSidePanelContent(
        `Duplicate ${profile.title}`,
        <Suspense fallback={<LoadingState />}>
          <SecurityProfileForm
            confirmationStepDescription="To duplicate the profile, you need to run it."
            initialValues={{
              day_of_month_type: "day-of-month",
              days: [],
              delivery_time: "asap",
              end_date: "",
              end_type: "never",
              every: 1,
              months: [],
              randomize_delivery: "no",
              start_date: moment().format(INPUT_DATE_TIME_FORMAT),
              start_type: "",
              tailoring_file: null,
              unit_of_time: "DAILY",
              ...profile,
              title: `${profile.title} copy`,
            }}
            mutate={addSecurityProfile}
            onSuccess={(values) => {
              notifyCreation(values, notify);
            }}
            submitButtonText="Duplicate"
            submitting={isSecurityProfileAdding}
          />
        </Suspense>,
      );
    },

    edit: () => {
      setSidePanelContent(
        `Edit ${profile.title}`,
        <Suspense fallback={<LoadingState />}>
          <SecurityProfileForm
            benchmarkStepDisabled
            confirmationStepDescription="To save your changes, you need to run the profile."
            getConfirmationStepDisabled={(values) => values.mode == "audit"}
            initialValues={{
              day_of_month_type: "day-of-month",
              days: [],
              delivery_time: "asap",
              end_date: "",
              end_type: "never",
              every: 1,
              months: [],
              randomize_delivery: "no",
              start_date: moment().format(INPUT_DATE_TIME_FORMAT),
              start_type: "",
              tailoring_file: null,
              unit_of_time: "DAILY",
              ...profile,
            }}
            mutate={async (params) => {
              updateSecurityProfile({ id: profile.id, ...params });
            }}
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
            submitButtonText="Save changes"
            submitting={isSecurityProfileUpdating}
          />
        </Suspense>,
      );
    },

    run: async () => {
      if (!profile.mode.includes("fix")) {
        await handleRunSecurityProfile(profile);
        return;
      }

      setSidePanelContent(
        `Run "${profile.name}" profile`,
        <Suspense fallback={<LoadingState />}>
          <SecurityProfileRunFixForm
            profile={profile}
            onSubmit={async () => {
              await handleRunSecurityProfile(profile);
            }}
          />
        </Suspense>,
      );
    },

    viewDetails: () => {
      setSidePanelContent(
        profile.name,
        <Suspense fallback={<LoadingState />}>
          <SecurityProfileDetails
            actions={actions(profile)}
            profile={profile}
          />
        </Suspense>,
        "medium",
      );
    },
  });

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
            className={`${classes.ellipsisButton} u-no-margin--bottom u-no-padding--top`}
            onClick={actions(profile).viewDetails}
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
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          const { passing, failing, in_progress } =
            row.original.last_run_results;
          const total = row.original.associated_instances;

          const notRun = total - (passing + failing + in_progress);

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
                position="btm-center"
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
            <span className={classes.ellipsis}>
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
              position="top-center"
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
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => (
          <SecurityProfileListContextualMenu
            actions={actions(profile)}
            profile={profile}
          />
        ),
      },
    ],
    [securityProfiles],
  );

  return (
    <ModularTable
      emptyMsg="No security profiles found according to your search parameters."
      columns={columns}
      data={securityProfiles}
    />
  );
};

export default SecurityProfilesList;
