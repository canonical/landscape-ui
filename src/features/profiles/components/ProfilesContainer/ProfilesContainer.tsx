import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { type FC } from "react";
import ProfilesHeader from "../ProfilesHeader";
import ProfilesList from "../ProfilesList";
import ProfilesEmptyState from "../ProfilesEmptyState";
import type { Profile, ProfileType } from "../../types";
import { TablePagination } from "@/components/layout/TablePagination";
import { Notification } from "@canonical/react-components";
import { canArchiveProfile } from "../../helpers";
import { useBoolean } from "usehooks-ts";

interface ProfilesContainerProps {
  readonly type: ProfileType;
  readonly profiles: Profile[];
  readonly isPending: boolean;
  readonly profilesCount?: number;
  readonly isProfileLimitReached?: boolean;
}
const ProfilesContainer: FC<ProfilesContainerProps> = ({
  type,
  profiles,
  isPending,
  isProfileLimitReached,
  profilesCount,
}) => {
  const { search } = usePageParams();
  const {
    value: isNotificationVisible,
    setFalse: hideNotification,
  } = useBoolean(true);

  if (isPending) {
    return <LoadingState />;
  }

  if (profiles.length === 0 && !search) {
    return <ProfilesEmptyState type={type} />;
  }

  const removalType = canArchiveProfile(type) ? "archive" : "remove";

  return (
    <>
      <ProfilesHeader type={type} isProfileLimitReached={isProfileLimitReached}/>
      {isNotificationVisible && isProfileLimitReached && (
        <Notification
          severity="caution"
          inline
          title="Profile limit reached:"
          onDismiss={hideNotification}
        >
          You&apos;ve reached the limit of {profilesCount ?? profiles.length} active
          {" "}{type} profiles. You must {removalType} an active profile to be able
          to add a new one.
        </Notification>
      )}
      <ProfilesList profiles={profiles} type={type} />
      {!!profilesCount &&
        <TablePagination
          totalItems={profilesCount}
          currentItemCount={profiles.length}
        />
      }
    </>
  );
};

export default ProfilesContainer;
