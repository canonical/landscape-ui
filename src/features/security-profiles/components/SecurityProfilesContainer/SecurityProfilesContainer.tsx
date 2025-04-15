import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import SecurityProfilesEmptyState from "../SecurityProfilesEmptyState";
import SecurityProfilesHeader from "../SecurityProfilesHeader";
import SecurityProfilesList from "../SecurityProfilesList";
import LoadingState from "@/components/layout/LoadingState";
import { useGetSecurityProfiles } from "../../api/useGetSecurityProfiles";
import { Button, Notification } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import { Suspense } from "react";
import useNotify from "@/hooks/useNotify";
import SecurityProfileForm from "../SecurityProfileForm";
import { useUpdateSecurityProfile } from "../../api/useUpdateSecurityProfile";
import type { SecurityProfile } from "../../types";
import { useNavigate, useLocation } from "react-router";

const SecurityProfilesContainer: FC = () => {
  const { currentPage, pageSize, search, statuses } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { notify } = useNotify();
  const { updateSecurityProfile } = useUpdateSecurityProfile();

  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      search,
      statuses: statuses.length === 0 ? [] : statuses,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });
  const navigate = useNavigate();
  const location = useLocation();

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

  if (isSecurityProfilesLoading) {
    return <LoadingState />;
  }

  if (!securityProfiles.length && !search && !statuses.length) {
    return <SecurityProfilesEmptyState />;
  }
  return (
    <>
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
          <strong>{profilesExceedingLimit[0].name}</strong> is assigned to more
          than <strong>5,000 instances</strong>. Only the first 5,000 will be
          covered. Edit the profile or duplicate it to cover the rest.{" "}
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

      <SecurityProfilesHeader />
      <SecurityProfilesList
        securityProfiles={securityProfiles as SecurityProfile[]}
      />
    </>
  );
};

export default SecurityProfilesContainer;
