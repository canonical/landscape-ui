import EmptyState from "@/components/layout/EmptyState";
import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
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
  const { currentPage, pageSize, search, statuses } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      search,
      statuses: statuses.length === 0 ? [] : statuses,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  const { updateSecurityProfile } = useUpdateSecurityProfile();

  const [isRetentionNotificationVisible, setIsRetentionNotificationVisible] =
    useState(false);

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

  if (isSecurityProfilesLoading) {
    return <LoadingState />;
  }

  const addButton = (
    <Button
      key="add"
      type="button"
      appearance="positive"
      onClick={addSecurityProfile}
    >
      Add security profile
    </Button>
  );

  if (!securityProfiles.length && !search && !statuses.length) {
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
        );
      </PageMain>
    );
  }

  const isFiveOrMoreProfiles = securityProfiles.length >= 5;

  const profilesExceedingLimit = securityProfiles.filter(
    (profile) => profile.associated_instances > 5000,
  );

  const hasOverLimit = profilesExceedingLimit.length > 0;

  if (sessionStorage.getItem("hasProfileOverLimit") !== String(hasOverLimit)) {
    if (hasOverLimit) {
      sessionStorage.setItem("hasProfileOverLimit", "true");
    } else {
      sessionStorage.removeItem("hasProfileOverLimit");
    }

    window.dispatchEvent(new CustomEvent("profile-limit-badge-update"));
  }

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

        <Notification inline title="Your audit is ready for download:">
          Your audit has been successfully generated and is now ready for
          download.{" "}
          <Button type="button" appearance="link" onClick={() => undefined}>
            Download audit
          </Button>
        </Notification>

        {profilesExceedingLimit.length > 1 && (
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
                  search: "?statuses=over-limit",
                });
              }}
            >
              View profiles
            </Button>
          </Notification>
        )}

        {isFiveOrMoreProfiles && (
          <Notification
            severity="caution"
            inline
            title="Security profiles limit reached:"
          >
            You&apos;ve reached the maximum of{" "}
            <strong>5 Security profiles</strong>. To add more, archive profiles
            that are no longer in use to free up space for active ones.
          </Notification>
        )}

        {profilesExceedingLimit.length === 1 && (
          <Notification
            severity="negative"
            inline
            title="Profile exceeded associated instance limit:"
          >
            Your security profile{" "}
            <strong>{profilesExceedingLimit[0].name}</strong> is assigned to
            more than <strong>5,000 instances</strong>. Only the first 5,000
            will be covered. Edit the profile or duplicate it to cover the rest.{" "}
            <Button
              type="button"
              appearance="link"
              onClick={() => {
                const [profile] = profilesExceedingLimit;
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

        <SecurityProfilesHeader />
        <SecurityProfilesList securityProfiles={securityProfiles} />
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
