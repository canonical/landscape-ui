import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import { useActivities } from "@/features/activities";
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "@/features/security-profiles";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Notification } from "@canonical/react-components";
import moment from "moment";
import { type FC, Suspense, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  useGetOverLimitSecurityProfiles,
  useGetSecurityProfiles,
  useIsSecurityProfilesLimitReached,
  useUpdateSecurityProfile,
} from "../../api";
import SecurityProfileForm from "../SecurityProfileForm";
import SecurityProfilesHeader from "../SecurityProfilesHeader";
import SecurityProfilesList from "../SecurityProfilesList";

interface SecurityProfilesContainerProps {
  readonly hideRetentionNotification: () => void;
  readonly retentionNotificationVisible?: boolean;
}

const SecurityProfilesContainer: FC<SecurityProfilesContainerProps> = ({
  hideRetentionNotification,
  retentionNotificationVisible,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { currentPage, pageSize, search, status, passRateFrom, passRateTo } =
    usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const profileLimitReached = useIsSecurityProfilesLimitReached();

  const { securityProfiles, securityProfilesCount, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      search,
      status: status == "all" ? undefined : status || "active",
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      pass_rate_from: passRateFrom != 0 ? passRateFrom : undefined,
      pass_rate_to: passRateTo != 100 ? passRateFrom : undefined,
    });

  const { overLimitSecurityProfiles } = useGetOverLimitSecurityProfiles({
    limit: 20,
    offset: 0,
  });

  const pendingReports = JSON.parse(
    localStorage.getItem("_landscape_pendingSecurityProfileReports") ?? "[]",
  ) as { activityId: number; profileId: number }[];

  const { getActivitiesQuery } = useActivities();
  const { data: getActivitiesQueryResponse } = getActivitiesQuery(
    {
      query: pendingReports
        .map((report) => `id:${report.activityId}`)
        .join(" OR "),
    },
    { enabled: !!pendingReports.length },
  );

  const { updateSecurityProfile } = useUpdateSecurityProfile();

  const [
    isProfileLimitNotificationIgnored,
    setIsProfileLimitNotificationIgnored,
  ] = useState(
    localStorage.getItem(
      "_landscape_isSecurityProfileLimitNotificationIgnored",
    ) == "true",
  );

  const handleEditProfile = () => {
    const [profile] = overLimitSecurityProfiles;

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
            start_date: moment().utc().format(INPUT_DATE_TIME_FORMAT),
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
              message: "Your changes have been saved successfully.",
            });
          }}
          submitButtonText="Save changes"
          submitting={false}
        />
      </Suspense>,
    );
  };

  const activities =
    getActivitiesQueryResponse?.data.results.filter(
      (activity) => activity.activity_status == "succeeded",
    ) ?? [];

  return (
    <>
      {retentionNotificationVisible && (
        <IgnorableNotifcation
          inline
          title="Audit retention policy:"
          storageKey="_landscape_isAuditModalIgnored"
          hide={hideRetentionNotification}
          modalProps={{
            title: "Dismiss audit retention acknowledgment",
            confirmButtonAppearance: "positive",
            confirmButtonLabel: "Dismiss",
            checkboxProps: {
              label:
                "I understand and acknowledge this policy. Don't show this message again.",
            },
          }}
        >
          <>
            Any audit older than the specified retention period for a given
            profile will be automatically removed. We recommend downloading and
            storing audit data externally before it expires. You can view the
            exact retention period for each profile in its details.
          </>
        </IgnorableNotifcation>
      )}

      {overLimitSecurityProfiles.length > 1 && (
        <Notification
          severity="negative"
          inline
          title="Profiles exceeded associated instance limit:"
        >
          Some of your security profiles are assigned to more than{" "}
          <strong>
            {SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT.toLocaleString()}{" "}
            instances
          </strong>
          . Only the first{" "}
          {SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT.toLocaleString()} will be
          audited. Edit the profiles or duplicate them to cover the rest.{" "}
          <Button
            type="button"
            appearance="link"
            onClick={() => {
              navigate({
                pathname: location.pathname,
                search: "?status=over-limit",
              });
            }}
          >
            View profiles
          </Button>
        </Notification>
      )}

      {overLimitSecurityProfiles.length === 1 && (
        <Notification
          severity="negative"
          inline
          title="Profile exceeded associated instance limit:"
        >
          Your security profile{" "}
          <strong>{overLimitSecurityProfiles[0].title}</strong> is assigned to
          more than{" "}
          <strong>
            {SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT.toLocaleString()}{" "}
            instances
          </strong>
          . Only the first{" "}
          {SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT.toLocaleString()} will be
          covered. Edit the profile or duplicate it to cover the rest.{" "}
          <Button type="button" appearance="link" onClick={handleEditProfile}>
            Edit profile
          </Button>
        </Notification>
      )}

      {profileLimitReached && !isProfileLimitNotificationIgnored && (
        <Notification
          severity="caution"
          inline
          title="Security profiles limit reached:"
          onDismiss={() => {
            localStorage.setItem(
              "_landscape_isSecurityProfileLimitNotificationIgnored",
              "true",
            );

            setIsProfileLimitNotificationIgnored(true);
          }}
        >
          You&apos;ve reached the maximum of{" "}
          <strong>5 security profiles</strong>. To add more, archive profiles
          that are no longer in use to free up space for active ones.
        </Notification>
      )}

      {activities.length > 1 && (
        <Notification
          inline
          title="Your audits are ready for download:"
          onDismiss={() => {
            localStorage.removeItem("_landscape_pendingSecurityProfileReports");
          }}
        >
          Several of your audits have been successfully generated and are now
          ready for download.{" "}
          <Button
            appearance="link"
            type="button"
            onClick={() => {
              for (const activity of activities) {
                window.open(activity.result_text ?? "");
              }
            }}
          >
            Download audits
          </Button>
        </Notification>
      )}

      {activities.length == 1 && (
        <Notification
          inline
          title="Your audit is ready for download:"
          onDismiss={() => {
            localStorage.removeItem("_landscape_pendingSecurityProfileReports");
          }}
        >
          Your audit has been successfully generated and is now ready for
          download.{" "}
          <a href={activities[0].result_text ?? ""} download>
            Download audit
          </a>
        </Notification>
      )}

      <SecurityProfilesHeader />

      {isSecurityProfilesLoading ? (
        <LoadingState />
      ) : (
        <>
          <SecurityProfilesList securityProfiles={securityProfiles} />
          <TablePagination
            totalItems={securityProfilesCount}
            currentItemCount={securityProfiles.length}
          />
        </>
      )}
    </>
  );
};

export default SecurityProfilesContainer;
