import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { type FC } from "react";
import ProfilesHeader from "../ProfilesHeader";
import ProfilesList from "../ProfilesList";
import ProfilesEmptyState from "../ProfilesEmptyState";
import type { Profile } from "../../types";
import { TablePagination } from "@/components/layout/TablePagination";
import { Notification } from "@canonical/react-components";
import { canArchiveProfile, type ProfileTypes } from "../../helpers";
import { useBoolean } from "usehooks-ts";
import useProfiles from "@/hooks/useProfiles";

interface ProfilesContainerProps {
  readonly type: ProfileTypes;
  readonly profiles: Profile[];
  readonly isPending: boolean;
  readonly profilesCount?: number;
}
const ProfilesContainer: FC<ProfilesContainerProps> = ({
  type,
  profiles,
  isPending,
  profilesCount,
}) => {
  const { isProfileLimitReached, profileLimit } = useProfiles();
  const { search } = usePageParams();
  const { value: isNotificationVisible, setFalse: hideNotification } =
    useBoolean(true);

  if (isPending) {
    return <LoadingState />;
  }

  if (profiles.length === 0 && !search) {
    return <ProfilesEmptyState type={type} />;
  }

  const removalType = canArchiveProfile(type) ? "archive" : "remove";

  return (
    <>
      <ProfilesHeader type={type} />
      {isNotificationVisible && isProfileLimitReached && (
        <Notification
          severity="caution"
          inline
          title="Profile limit reached:"
          onDismiss={hideNotification}
        >
          You&apos;ve reached the limit of {profileLimit} active {type}{" "}
          profiles. You must {removalType} an active profile to be able to add a
          new one.
        </Notification>
      )}
      <ProfilesList profiles={profiles} type={type} />
      {!!profilesCount && (
        <TablePagination
          totalItems={profilesCount}
          currentItemCount={profiles.length}
        />
      )}
    </>
  );
};

export default ProfilesContainer;
