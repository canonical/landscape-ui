import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import { useGetActivities } from "@/features/activities";
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "../../constants";
import { hasOneItem } from "@/utils/_helpers";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useGetOverLimitSecurityProfiles } from "../../api";
import { useSecurityProfileDownloadAudit } from "../../hooks/useSecurityProfileDownloadAudit";
import { useOpenProfileSidePanel } from "@/features/profiles";

interface SecurityProfilesNotificationsProps {
  readonly isRetentionNotificationVisible: boolean;
  readonly hideRetentionNotification: () => void;
}

const SecurityProfilesNotifications: FC<SecurityProfilesNotificationsProps> = ({
  isRetentionNotificationVisible,
  hideRetentionNotification,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const openProfileSidePanel = useOpenProfileSidePanel();

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

  return (
    <>
      {isRetentionNotificationVisible && (
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
            onClick={() => {
              openProfileSidePanel(overLimitSecurityProfiles[0], "edit");
            }}
          >
            Edit profile
          </Button>
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
    </>
  );
};

export default SecurityProfilesNotifications;
