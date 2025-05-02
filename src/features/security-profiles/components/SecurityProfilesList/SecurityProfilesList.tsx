import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useUpdateSecurityProfile } from "@/features/security-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable, Tooltip } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { CellProps, Column } from "react-table";
import {
  useAddSecurityProfile,
  useIsSecurityProfilesLimitReached,
  useRunSecurityProfile,
} from "../../api";
import { SECURITY_PROFILE_MODE_LABELS } from "../../constants";
import {
  getAssociatedInstancesLink,
  getSchedule,
  getStatus,
  getTags,
  notifyCreation,
} from "../../helpers";
import type { SecurityProfile, SecurityProfileActions } from "../../types";
import SecurityProfileArchiveModal from "../SecurityProfileArchiveModal";
import SecurityProfileListContextualMenu from "../SecurityProfilesContextualMenu";
import { getInitialValues, getNotificationMessage } from "./helpers";
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

const NAME_HEADER = (
  <span style={{ display: "inline-block", marginTop: "0px" }}>Name</span>
);

const STATUS_HEADER = (
  <span style={{ display: "inline-block", marginTop: "0px" }}>Status</span>
);

const PASSRATE_HEADER = (
  <span style={{ display: "inline-block", marginTop: "0px" }}>
    Last audit&apos;s pass rate
  </span>
);

const ASSOCIATED_INSTANCES_HEADER = (
  <span style={{ display: "inline-block", marginTop: "18px" }}>
    associated instances
    <br />
    tags
  </span>
);

const MODE_HEADER = (
  <span style={{ display: "inline-block", marginTop: "0px" }}>
    Profile mode
  </span>
);

const LAST_RUN_HEADER = (
  <span style={{ display: "inline-block", marginTop: "18px" }}>
    last run
    <br />
    schedule
  </span>
);

const ACTIONS_HEADER = (
  <span style={{ display: "inline-block", marginTop: "0px" }}>Actions</span>
);

interface SecurityProfilesListProps {
  readonly securityProfiles: SecurityProfile[];
}

const SecurityProfilesList: FC<SecurityProfilesListProps> = ({
  securityProfiles,
}) => {
  const navigate = useNavigate();
  const { notify } = useNotify();
  const debug = useDebug();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const profileLimitReached = useIsSecurityProfilesLimitReached();

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
              navigate(`/activities?query=parent-id%3A${activity.id}`);
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
              ...getInitialValues(profile),
              title: `${profile.title} copy`,
            }}
            mutate={async (values) => {
              addSecurityProfile({
                access_group: values.access_group,
                all_computers: values.all_computers,
                benchmark: values.benchmark,
                mode: values.mode,
                restart_deliver_delay: values.restart_deliver_delay,
                restart_deliver_delay_window:
                  values.restart_deliver_delay_window,
                schedule: values.schedule,
                start_date: values.start_date,
                tags: values.tags,
                tailoring_file: values.tailoring_file,
                title: values.title,
              });
            }}
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
            initialValues={getInitialValues(profile)}
            mutate={async (values) => {
              updateSecurityProfile({
                id: profile.id,
                access_group: values.access_group,
                all_computers: values.all_computers,
                restart_deliver_delay: values.restart_deliver_delay,
                restart_deliver_delay_window:
                  values.restart_deliver_delay_window,
                schedule: values.schedule,
                tags: values.tags,
                title: values.title,
              });
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
            profileLimitReached={profileLimitReached}
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
        Header: NAME_HEADER,
        className: classes.nameCell,
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) => {
          return (
            <Button
              appearance="link"
              type="button"
              className={`${classes.ellipsisButton} u-no-margin--bottom u-no-padding--top u-align--left`}
              onClick={actions(profile).viewDetails}
            >
              {profile.title}
            </Button>
          );
        },
      },
      {
        accessor: "status",
        Header: STATUS_HEADER,
        className: classes.status,
        Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) =>
          getStatus(profile).label,
        getCellIcon: ({
          row: { original: profile },
        }: CellProps<SecurityProfile>) => getStatus(profile).icon,
      },
      {
        accessor: "lastAuditPassrate",
        Header: PASSRATE_HEADER,
        Cell: ({ row }: CellProps<SecurityProfile>) => {
          const { passing, failing, in_progress } =
            row.original.last_run_results;

          const { not_started } = row.original.last_run_results;
          const total = passing + failing + in_progress + not_started;

          const lastRunHasTotal = !!total;

          const passRate = ((passing / total) * 100).toFixed(0);
          const failRate = ((failing / total) * 100).toFixed(0);
          const inProgressRate = ((in_progress / total) * 100).toFixed(0);
          const notRunRate = ((not_started / total) * 100).toFixed(0);

          const totalPercent =
            parseInt(passRate) +
            parseInt(failRate) +
            parseInt(inProgressRate) +
            parseInt(notRunRate);
          const difference = 100 - totalPercent;

          const adjustedPassingPercent = (
            parseInt(passRate) + difference
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
                  {`${failing} instances (${failRate}%)`}
                </div>
                <div>
                  <strong>In progress:</strong>{" "}
                  {`${in_progress} instances (${inProgressRate}%)`}
                </div>
                <div>
                  <strong>Not Run:</strong>{" "}
                  {`${not_started} instances (${notRunRate}%)`}
                </div>
              </div>
            </>
          );

          return (
            <div>
              {lastRunHasTotal ? (
                <>
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
                </>
              ) : (
                <NoData />
              )}
            </div>
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
              {getAssociatedInstancesLink(profile)}
              <br />
              {getTags(profile)}
            </div>
          </>
        ),
      },
      {
        accessor: "mode",
        Header: MODE_HEADER,
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
                {lastRun}
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
        accessor: "id",
        className: classes.actions,
        Header: ACTIONS_HEADER,
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

      {modalProfile && (
        <SecurityProfileArchiveModal
          close={closeModal}
          profile={modalProfile}
        />
      )}
    </>
  );
};

export default SecurityProfilesList;
