import type { Profile } from "../../../../types";
import ProfileAssociatedInstancesLink from "../../../ProfileAssociatedInstancesLink";
import { useGetProfileAssociatedCount } from "../../../../hooks/useGetProfileAssociatedCount";
import type { ProfileTypes } from "../../../../helpers";

interface AssociatedInstancesCellProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
}

function AssociatedInstancesCell({
  profile,
  type,
}: AssociatedInstancesCellProps) {
  const { associatedCount, isGettingInstances } =
    useGetProfileAssociatedCount(profile);

  return (
    <ProfileAssociatedInstancesLink
      profile={profile}
      count={associatedCount}
      query={`${type}:${profile.id}`}
      isPending={isGettingInstances}
      isGeneralAssociation
    />
  );
}

export default AssociatedInstancesCell;
