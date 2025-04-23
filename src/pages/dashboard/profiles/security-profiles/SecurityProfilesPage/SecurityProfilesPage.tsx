import EmptyState from "@/components/layout/EmptyState";
import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { TablePagination } from "@/components/layout/TablePagination";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import { useActivities } from "@/features/activities";
import {
  SecurityProfileForm,
  SecurityProfilesHeader,
  SecurityProfilesList,
  useGetSecurityProfiles,
  useUpdateSecurityProfile,
} from "@/features/security-profiles";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Notification } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const SecurityProfileAddForm = lazy(
  async () =>
    import("@/features/security-profiles/components/SecurityProfileAddForm"),
);

const SecurityProfilesPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { currentPage, pageSize, search, status, passRateFrom, passRateTo } =
    usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const { securityProfiles, securityProfilesCount, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      search,
      status,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      pass_rate_from: passRateFrom,
      pass_rate_to: passRateTo,
    });

  const {
    securityProfiles: overLimitSecurityProfiles,
    isSecurityProfilesLoading: isOverLimitSecurityProfilesLoading,
  } = useGetSecurityProfiles({
    status: "over-limit",
  });

  const {
    securityProfilesCount: activeSecurityProfilesCount,
    isSecurityProfilesLoading: isActiveSecurityProfilesLoading,
  } = useGetSecurityProfiles({
    status: "active",
  });

  const { getActivitiesQuery } = useActivities();

  const pendingReports = JSON.parse(
    localStorage.getItem("_landscape_pendingSecurityProfileReports") ?? "[]",
  ) as { activityId: number; profileId: number }[];

  const { data: getActivitiesQueryResponse, isLoading: isGettingActivities } =
    getActivitiesQuery(
      {
        query: pendingReports
          .map((report) => `id:${report.activityId}`)
          .join(" OR "),
      },
      { enabled: !!pendingReports.length },
    );

  const { updateSecurityProfile } = useUpdateSecurityProfile();

  const [isRetentionNotificationVisible, setIsRetentionNotificationVisible] =
    useState(false);
  const [
    isProfileLimitNotificationIgnored,
    setIsProfileLimitNotificationIgnored,
  ] = useState(
    localStorage.getItem(
      "_landscape_isSecurityProfileLimitNotificationIgnored",
    ) == "true",
  );

  const showNotification = () => {
    setIsRetentionNotificationVisible(true);
  };

  const hideNotification = () => {
    setIsRetentionNotificationVisible(false);
  };

  const addSecurityProfile = () => {
    setSidePanelContent(
      "Add security profile",
      <Suspense>
        <SecurityProfileAddForm onSuccess={showNotification} />
      </Suspense>,
    );
  };

  if (isSecurityProfilesLoading || isActiveSecurityProfilesLoading) {
    return <LoadingState />;
  }

  const profileLimitReached = activeSecurityProfilesCount >= 5;

  const addButton = (
    <Button
      key="add"
      type="button"
      appearance="positive"
      onClick={addSecurityProfile}
      disabled={profileLimitReached}
    >
      Add security profile
    </Button>
  );

  if (!securityProfiles.length && !search && !status) {
    return (
      <PageMain>
        <PageHeader title="Security profiles" />
        <EmptyState
          body={
            <p>
              Add a security profile to ensure security and complaince across
              your instances. Security profile audits aggregate audit results
              over time and in bulk, helping you align with tailored security
              benchmarks, run scheduled audits, and generate detailed audits for
              your estate.
            </p>
          }
          cta={[addButton]}
          title="You don't have any security profiles yet"
        />
      </PageMain>
    );
  }

  if (isGettingActivities || isOverLimitSecurityProfilesLoading) {
    return <LoadingState />;
  }

  const activities =
    getActivitiesQueryResponse?.data.results.filter(
      (activity) => activity.activity_status == "succeeded",
    ) ?? [];

  return (
    <PageMain>
      <PageHeader title="Security profiles" actions={[addButton]} />

      <PageContent>
        {isRetentionNotificationVisible && (
          <IgnorableNotifcation
            inline
            title="Audit retention policy:"
            storageKey="_landscape_isAuditModalIgnored"
            hide={hideNotification}
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
              profile will be automatically removed. We recommend downloading
              and storing audit data externally before it expires. You can view
              the exact retention period for each profile in its details.
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
            <strong>5,000 instances</strong>. Only the first 5,000 will be
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
            <strong>{overLimitSecurityProfiles[0].name}</strong> is assigned to
            more than <strong>5,000 instances</strong>. Only the first 5,000
            will be covered. Edit the profile or duplicate it to cover the rest.{" "}
            <Button
              type="button"
              appearance="link"
              onClick={() => {
                const [profile] = overLimitSecurityProfiles;
                setSidePanelContent(
                  `Edit ${profile.title}`,
                  <Suspense fallback={<LoadingState />}>
                    <SecurityProfileForm
                      benchmarkStepDisabled
                      confirmationStepDescription="To save your changes, you need to run the profile."
                      getConfirmationStepDisabled={(values) =>
                        values.mode == "audit"
                      }
                      initialValues={{
                        day_of_month_type: "day-of-month",
                        days: [],
                        delivery_time: "asap",
                        end_date: "",
                        end_type: "never",
                        every: 1,
                        months: [],
                        randomize_delivery: "no",
                        start_date: moment()
                          .utc()
                          .format(INPUT_DATE_TIME_FORMAT),
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
              }}
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
              localStorage.removeItem(
                "_landscape_pendingSecurityProfileReports",
              );
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
              localStorage.removeItem(
                "_landscape_pendingSecurityProfileReports",
              );
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

        <SecurityProfilesList
          profileLimitReached={profileLimitReached}
          securityProfiles={securityProfiles}
        />

        <TablePagination
          totalItems={securityProfilesCount}
          currentItemCount={securityProfiles.length}
        />
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
