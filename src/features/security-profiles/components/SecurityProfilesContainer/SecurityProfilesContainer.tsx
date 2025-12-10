import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { useGetActivities } from "@/features/activities";
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "@/features/security-profiles";
import usePageParams from "@/hooks/usePageParams";
import { hasOneItem } from "@/utils/_helpers";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  useGetOverLimitSecurityProfiles,
  useGetSecurityProfiles,
  useIsSecurityProfilesLimitReached,
} from "../../api";
import { useSecurityProfileDownloadAudit } from "../../hooks/useSecurityProfileDownloadAudit";
import SecurityProfilesHeader from "../SecurityProfilesHeader";
import SecurityProfilesList from "../SecurityProfilesList";

interface SecurityProfilesContainerProps {
  readonly hideRetentionNotification: () => void;
  readonly retentionNotificationVisible?: boolean;
}

const getStatus = (status: string) => {
  if (status === "all") {
    return undefined;
  }

  if (status) {
    return status;
  }

  return "active";
};

const SecurityProfilesContainer: FC<SecurityProfilesContainerProps> = ({
  hideRetentionNotification,
  retentionNotificationVisible,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPage, pageSize, search, status, passRateFrom, passRateTo } =
    usePageParams();
  const { createPageParamsSetter } = usePageParams();
  const profileLimitReached = useIsSecurityProfilesLimitReached();

  const { securityProfiles, securityProfilesCount, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      search,
      status: getStatus(status),
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      pass_rate_from: passRateFrom != 0 ? passRateFrom : undefined,
      pass_rate_to: passRateTo != 100 ? passRateTo : undefined,
    });

  const { overLimitSecurityProfiles } = useGetOverLimitSecurityProfiles({
    limit: 20,
    offset: 0,
  });

  const [pendingReports, setPendingReports] = useState<
    { activityId: number; profileId: number }[]
  >(
    JSON.parse(
      localStorage.getItem("_landscape_pendingSecurityProfileReports") ?? "[]",
    ),
  );

  const { activities } = useGetActivities(
    {
      query: `status:succeeded ${pendingReports
        .map((report) => `id:${report.activityId}`)
        .join(" OR ")}`,
    },
    { listenToUrlParams: false },
    { enabled: !!pendingReports.length },
  );

  const downloadAudit = useSecurityProfileDownloadAudit();

  const [
    isProfileLimitNotificationIgnored,
    setIsProfileLimitNotificationIgnored,
  ] = useState(
    localStorage.getItem(
      "_landscape_isSecurityProfileLimitNotificationIgnored",
    ) == "true",
  );

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

      {hasOneItem(overLimitSecurityProfiles) && (
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
          <Button
            type="button"
            appearance="link"
            onClick={createPageParamsSetter({
              sidePath: ["edit"],
              profile: overLimitSecurityProfiles[0].id.toString(),
            })}
          >
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
            setPendingReports([]);
          }}
        >
          Several of your audits have been successfully generated and are now
          ready for download.{" "}
          <Button
            appearance="link"
            type="button"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              for (const activity of activities) {
                downloadAudit(activity.result_text);
              }
            }}
          >
            Download audits
          </Button>
        </Notification>
      )}

      {hasOneItem(activities) && (
        <Notification
          inline
          title="Your audit is ready for download:"
          onDismiss={() => {
            localStorage.removeItem("_landscape_pendingSecurityProfileReports");
            setPendingReports([]);
          }}
        >
          Your audit has been successfully generated and is now ready for
          download.{" "}
          <Button
            appearance="link"
            type="button"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              downloadAudit(activities[0].result_text);
            }}
          >
            Download audit
          </Button>
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
