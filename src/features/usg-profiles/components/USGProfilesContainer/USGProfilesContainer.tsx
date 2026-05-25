import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import { useGetActivities } from "@/features/activities";
<<<<<<<< HEAD:src/features/security-profiles/components/SecurityProfilesNotifications/SecurityProfilesNotifications.tsx
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "../../constants";
========
import { USG_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "@/features/usg-profiles";
import usePageParams from "@/hooks/usePageParams";
>>>>>>>> main:src/features/usg-profiles/components/USGProfilesContainer/USGProfilesContainer.tsx
import { hasOneItem } from "@/utils/_helpers";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
<<<<<<<< HEAD:src/features/security-profiles/components/SecurityProfilesNotifications/SecurityProfilesNotifications.tsx
import { useGetOverLimitSecurityProfiles } from "../../api";
import { useSecurityProfileDownloadAudit } from "../../hooks/useSecurityProfileDownloadAudit";
import { useOpenProfileSidePanel } from "@/features/profiles";

interface SecurityProfilesNotificationsProps {
  readonly isRetentionNotificationVisible: boolean;
========
import {
  useGetOverLimitUsgProfiles,
  useGetUsgProfiles,
  useIsUsgProfilesLimitReached,
} from "../../api";
import { useUsgProfileDownload } from "../../hooks/useUsgProfileDownload";
import USGProfilesHeader from "../USGProfilesHeader";
import USGProfilesList from "../USGProfilesList";

interface USGProfilesContainerProps {
>>>>>>>> main:src/features/usg-profiles/components/USGProfilesContainer/USGProfilesContainer.tsx
  readonly hideRetentionNotification: () => void;
}

<<<<<<<< HEAD:src/features/security-profiles/components/SecurityProfilesNotifications/SecurityProfilesNotifications.tsx
const SecurityProfilesNotifications: FC<SecurityProfilesNotificationsProps> = ({
  isRetentionNotificationVisible,
========
const getStatus = (status: string) => {
  if (status === "all") {
    return undefined;
  }

  if (status) {
    return status;
  }

  return "active";
};

const USGProfilesContainer: FC<USGProfilesContainerProps> = ({
>>>>>>>> main:src/features/usg-profiles/components/USGProfilesContainer/USGProfilesContainer.tsx
  hideRetentionNotification,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<<< HEAD:src/features/security-profiles/components/SecurityProfilesNotifications/SecurityProfilesNotifications.tsx
  const openProfileSidePanel = useOpenProfileSidePanel();
========
  const { currentPage, pageSize, search, status, passRateFrom, passRateTo } =
    usePageParams();
  const { createPageParamsSetter } = usePageParams();
  const profileLimitReached = useIsUsgProfilesLimitReached();

  const { usgProfiles, usgProfilesCount, isUsgProfilesLoading } =
    useGetUsgProfiles({
      search,
      status: getStatus(status),
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      pass_rate_from: passRateFrom != 0 ? passRateFrom : undefined,
      pass_rate_to: passRateTo != 100 ? passRateTo : undefined,
    });
>>>>>>>> main:src/features/usg-profiles/components/USGProfilesContainer/USGProfilesContainer.tsx

  const { overLimitUsgProfiles } = useGetOverLimitUsgProfiles({
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

  const downloadAudit = useUsgProfileDownload("audit");

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

      {overLimitUsgProfiles.length > 1 && (
        <Notification
          severity="negative"
          inline
          title="Profiles exceeded associated instance limit:"
        >
          Some of your USG profiles are assigned to more than{" "}
          <strong>
            {USG_PROFILE_ASSOCIATED_INSTANCES_LIMIT.toLocaleString()} instances
          </strong>
          . Only the first{" "}
          {USG_PROFILE_ASSOCIATED_INSTANCES_LIMIT.toLocaleString()} will be
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

      {hasOneItem(overLimitUsgProfiles) && (
        <Notification
          severity="negative"
          inline
          title="Profile exceeded associated instance limit:"
        >
          Your USG profile <strong>{overLimitUsgProfiles[0].title}</strong> is
          assigned to more than{" "}
          <strong>
            {USG_PROFILE_ASSOCIATED_INSTANCES_LIMIT.toLocaleString()} instances
          </strong>
          . Only the first{" "}
          {USG_PROFILE_ASSOCIATED_INSTANCES_LIMIT.toLocaleString()} will be
          covered. Edit the profile or duplicate it to cover the rest.{" "}
          <Button
            type="button"
            appearance="link"
<<<<<<<< HEAD:src/features/security-profiles/components/SecurityProfilesNotifications/SecurityProfilesNotifications.tsx
            onClick={() => {
              openProfileSidePanel(overLimitSecurityProfiles[0], "edit");
            }}
========
            onClick={createPageParamsSetter({
              sidePath: ["edit"],
              name: overLimitUsgProfiles[0].id.toString(),
            })}
>>>>>>>> main:src/features/usg-profiles/components/USGProfilesContainer/USGProfilesContainer.tsx
          >
            Edit profile
          </Button>
        </Notification>
      )}

<<<<<<<< HEAD:src/features/security-profiles/components/SecurityProfilesNotifications/SecurityProfilesNotifications.tsx
========
      {profileLimitReached && !isProfileLimitNotificationIgnored && (
        <Notification
          severity="caution"
          inline
          title="USG profiles limit reached:"
          onDismiss={() => {
            localStorage.setItem(
              "_landscape_isSecurityProfileLimitNotificationIgnored",
              "true",
            );

            setIsProfileLimitNotificationIgnored(true);
          }}
        >
          You&apos;ve reached the maximum of <strong>5 USG profiles</strong>. To
          add more, archive profiles that are no longer in use to free up space
          for active ones.
        </Notification>
      )}

>>>>>>>> main:src/features/usg-profiles/components/USGProfilesContainer/USGProfilesContainer.tsx
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
<<<<<<<< HEAD:src/features/security-profiles/components/SecurityProfilesNotifications/SecurityProfilesNotifications.tsx
========

      <USGProfilesHeader />

      {isUsgProfilesLoading ? (
        <LoadingState />
      ) : (
        <>
          <USGProfilesList usgProfiles={usgProfiles} />
          <TablePagination
            totalItems={usgProfilesCount}
            currentItemCount={usgProfiles.length}
          />
        </>
      )}
>>>>>>>> main:src/features/usg-profiles/components/USGProfilesContainer/USGProfilesContainer.tsx
    </>
  );
};

<<<<<<<< HEAD:src/features/security-profiles/components/SecurityProfilesNotifications/SecurityProfilesNotifications.tsx
export default SecurityProfilesNotifications;
========
export default USGProfilesContainer;
>>>>>>>> main:src/features/usg-profiles/components/USGProfilesContainer/USGProfilesContainer.tsx
