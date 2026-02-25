import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { type FC } from "react";
import ProfilesHeader from "../ProfilesHeader";
import ProfilesList from "../ProfilesList";
import ProfilesEmptyState from "../ProfilesEmptyState";
import type { Profile, ProfileType } from "../../types";

interface ProfilesContainerProps {
  readonly type: ProfileType;
  readonly profiles: Profile[];
  readonly isPending: boolean;
}
const ProfilesContainer: FC<ProfilesContainerProps> = ({ type, profiles, isPending }) => {
  const { search } = usePageParams();

  if (isPending) {
    return <LoadingState />;
  }

  const hasNoProfiles = profiles.length === 0 && !search;
  
  return (
    <>
      {hasNoProfiles ? (
        <ProfilesEmptyState type={type} />
      ) : (
        <>
          <ProfilesHeader type={type} />
          <ProfilesList profiles={profiles} type={type} />
        </>
      )}
    </>
  );
};

export default ProfilesContainer;
