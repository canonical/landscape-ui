import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import SecurityProfilesEmptyState from "../SecurityProfilesEmptyState";
import SecurityProfilesHeader from "../SecurityProfilesHeader";
import SecurityProfilesList from "../SecurityProfilesList";
import LoadingState from "@/components/layout/LoadingState";
import { useGetSecurityProfiles } from "../../api/useGetSecurityProfiles";
import { Button, Notification } from "@canonical/react-components";

const SecurityProfilesContainer: FC = () => {
  const { currentPage, pageSize, search, statuses } = usePageParams();

  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      search,
      statuses: statuses.length === 0 ? [] : statuses,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  if (isSecurityProfilesLoading) {
    return <LoadingState />;
  }

  if (!securityProfiles.length && !search) {
    return <SecurityProfilesEmptyState />;
  }

  const isFiveOrMoreProfiles = securityProfiles.length >= 5;

  const profilesExceedingLimit = securityProfiles.filter(
    (profile) => profile.associated_instances > 5000,
  );

  const moreThanOneExceedingLimit = profilesExceedingLimit.length > 1;

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
          <Button type="button" appearance="link" onClick={() => undefined}>
            Edit profile
          </Button>
        </Notification>
      )}

      {moreThanOneExceedingLimit && (
        <Notification
          severity="negative"
          inline
          title="Profiles exceeded associated instance limit:"
        >
          Some of your security profiles are assigned to more than{" "}
          <strong>5,000 instances</strong>. Only the first 5,000 will be
          audited. Edit the profiles or duplicate them to cover the rest.{" "}
          <Button type="button" appearance="link" onClick={() => undefined}>
            View profiles
          </Button>
        </Notification>
      )}

      <SecurityProfilesHeader />
      <SecurityProfilesList securityProfiles={securityProfiles} />
    </>
  );
};

export default SecurityProfilesContainer;
