import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { type FC } from "react";
import ProfilesHeader from "../ProfilesHeader";
import ProfilesList from "../ProfilesList";
import ProfilesEmptyState from "../ProfilesEmptyState";
import type { Profile, ProfileType } from "../../types";
import { TablePagination } from "@/components/layout/TablePagination";

interface ProfilesContainerProps {
  readonly type: ProfileType;
  readonly profiles: Profile[];
  readonly isPending: boolean;
  readonly profilesCount?: number;
}
const ProfilesContainer: FC<ProfilesContainerProps> = ({ type, profiles, isPending, profilesCount }) => {
  const { search } = usePageParams();

  if (isPending) {
    return <LoadingState />;
  }

  if (profiles.length === 0 && !search) {
    return <ProfilesEmptyState type={type} />;
  }

  return (
    <>
      <ProfilesHeader type={type} />
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
