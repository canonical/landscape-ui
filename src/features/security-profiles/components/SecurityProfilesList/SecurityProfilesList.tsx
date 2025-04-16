import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable, Tooltip } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { useAddSecurityProfile, useRunSecurityProfile } from "../../api";
import { useUpdateSecurityProfile } from "../../api/useUpdateSecurityProfile";
import { SECURITY_PROFILE_STATUSES } from "../../constants";
import { notifyCreation } from "../../helpers";
import type { SecurityProfile, SecurityProfileActions } from "../../types";
import SecurityProfileArchiveModal from "../SecurityProfileArchiveModal";
import SecurityProfileListContextualMenu from "../SecurityProfilesContextualMenu";
import { getNotificationMessage } from "./helpers";
import classes from "./SecurityProfilesList.module.scss";

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

  const [modalProfile, setModalProfile] = useState<SecurityProfile | null>(
    null,
  );

  const handleRunSecurityProfile = async (profile: SecurityProfile) => {
    try {
      const { data: activity } = await runSecurityProfile({ id: profile.id });

      if (profile.mode.includes("fix")) {
        closeSidePanel();
      }

      const message = getNotificationMessage(profile.mode);

      notify.success({
        title: `You have successfully initiated run of the ${profile.title} security profile`,
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

  const actions = (
    profile: SecurityProfile,
    hasBackButton?: boolean,
  ): SecurityProfileActions => ({
    archive: () => {
      setModalProfile(profile);
    },

    downloadAudit: () => {
      setSidePanelContent(
        `Download audit for ${profile.title} security profile`,
        <Suspense fallback={<LoadingState />}>
          <SecurityProfileDownloadAuditForm
            profileId={profile.id}
            hasBackButton={hasBackButton}
            onBackButtonPress={actions(profile).viewDetails}
          />
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
              start_date: "",
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
            hasBackButton={hasBackButton}
            onBackButtonPress={actions(profile).viewDetails}
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
              start_date: "",
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
                    : values.mode == "audit-fix"
                      ? "The changes made will be applied after running the profile, which has been successfully initiated. It will apply remediation fixes on associated instances and generate an audit."
                      : "The changes made will be applied after running the profile, which has been successfully initiated. It will apply remediation fixes on associated instances, restart them, and generate an audit.",
              });
            }}
            submitButtonText="Save changes"
            submitting={isSecurityProfileUpdating}
            hasBackButton={hasBackButton}
            onBackButtonPress={actions(profile).viewDetails}
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
        `Run "${profile.title}" profile`,
        <Suspense fallback={<LoadingState />}>
          <SecurityProfileRunFixForm
            profile={profile}
            onSubmit={async () => {
              await handleRunSecurityProfile(profile);
            }}
            hasBackButton={hasBackButton}
            onBackButtonPress={actions(profile).viewDetails}
          />
        </Suspense>,
      );
    },

    viewDetails: () => {
      setSidePanelContent(
        profile.title,
        <Suspense fallback={<LoadingState />}>
          <SecurityProfileDetails
            actions={actions(profile, true)}
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
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => {
          return (
            <Button
              appearance="link"
              type="button"
              className={`${classes.ellipsisButton} u-no-margin--bottom u-no-padding--top`}
              onClick={actions(profile).viewDetails}
            >
              {profile.title}
            </Button>
          );
        },
      },
      {
        accessor: "status",
        Header: "Status",
        className: classes.status,
        Cell: ({
          row: {
            original: { status },
          },
        }: CellProps<SecurityProfile>) =>
          SECURITY_PROFILE_STATUSES[status].label,
        getCellIcon: ({
          row: {
            original: { status },
          },
        }: CellProps<SecurityProfile>) =>
          SECURITY_PROFILE_STATUSES[status].icon,
      },
      {
        accessor: "lastAuditPassrate",
        Header: "Last audit's passrate",
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          const { passing, failing, in_progress } =
            row.original.last_run_results;
          const total = row.original.associated_instances;

          if (!row.original.last_run_results.timestamp) return <NoData />;

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
                <Link
                  to={{
                    pathname: "/instances",
                    search: `?query=security-profile%3A${row.original.id}%3Apass`,
                  }}
                >
                  <span>{passing} passed</span>
                </Link>
                <Link
                  to={{
                    pathname: "/instances",
                    search: `?query=security-profile%3A${row.original.id}%3Afail`,
                  }}
                >
                  <span>{failing} failed</span>
                </Link>
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
            {profile.associated_instances > 0 ? (
              <Link
                to={{
                  pathname: "/instances",
                  search: `?tags=${profile.tags.join("%2C")}`,
                }}
              >
                {profile.associated_instances}{" "}
                {profile.associated_instances === 1 ? "instance" : "instances"}
              </Link>
            ) : (
              <span>{profile.associated_instances} instances</span>
            )}

            <br />

            {!profile.tags?.length ? (
              <NoData />
            ) : (
              <span className={classes.ellipsis}>
                {profile.tags.join(", ")}
              </span>
            )}
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
          } else if (mode === "audit-fix-restart") {
            return "fix, restart, audit";
          } else if (mode === "audit-fix") {
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
          const lastRun =
            !row.original.last_run_results.timestamp ||
            row.original.last_run_results.timestamp === "" ? (
              <NoData />
            ) : (
              moment(row.original.last_run_results.timestamp).format(
                DISPLAY_DATE_TIME_FORMAT,
              )
            );

          const nextRun =
            !row.original.next_run_time || row.original.next_run_time === "" ? (
              <NoData />
            ) : (
              moment(row.original.next_run_time).format(
                DISPLAY_DATE_TIME_FORMAT,
              )
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

  const closeModal = () => {
    setModalProfile(null);
  };

  return (
    <>
      <ModularTable
        emptyMsg="No security profiles found according to your search parameters."
        columns={columns}
        data={securityProfiles}
      />

      <SecurityProfileArchiveModal close={closeModal} profile={modalProfile} />
    </>
  );
};

export default SecurityProfilesList;
