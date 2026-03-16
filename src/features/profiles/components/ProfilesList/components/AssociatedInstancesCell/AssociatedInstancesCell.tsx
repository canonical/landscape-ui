import type { Profile } from "@/features/profiles";
import ProfileAssociatedInstancesLink from "../../../ProfileAssociatedInstancesLink";
import { useGetProfileAssociatedCount } from "../../../../hooks";
import type { ProfileTypes } from "../../../../helpers";

interface AssociatedInstancesCellProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
}

function AssociatedInstancesCell({ profile, type }: AssociatedInstancesCellProps) {
  const { associatedCount, isGettingInstances } = useGetProfileAssociatedCount(profile);

  return (
    <ProfileAssociatedInstancesLink
      profile={profile}
      count={associatedCount}
      query={`profile:${type}:${profile.id}`}
      isPending={isGettingInstances}
    />
  );
}

export default AssociatedInstancesCell;
