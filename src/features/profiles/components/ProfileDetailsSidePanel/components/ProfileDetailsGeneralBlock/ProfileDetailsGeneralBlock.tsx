import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import useRoles from "@/hooks/useRoles";
import { getTitleByName } from "@/utils/_helpers";
import type { FC } from "react";
import type { Profile, ProfileType } from "../../../../types";
import { canArchiveProfile, hasDescription, isProfileArchived } from "../../../../helpers";
import Blocks from "@/components/layout/Blocks";

interface ProfileDetailsGeneralBlockProps {
  readonly profile: Profile;
  readonly type: ProfileType;
}

const ProfileDetailsGeneralBlock: FC<ProfileDetailsGeneralBlockProps> = ({
  profile,
  type,
}) => {
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  if (isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const status = isProfileArchived(profile) ? "Archived" : "Active";

  return (
    <Blocks.Item title="GENERAL">
      <InfoGrid>
        <InfoGrid.Item label="Name" value={profile.name} />

        {canArchiveProfile(type) && 
          <InfoGrid.Item label="Status" value={status} />
        }
        
        <InfoGrid.Item
          label="Access group"
          value={getTitleByName(profile.access_group, accessGroupsData)}
        />

        {hasDescription(profile) && (
          <InfoGrid.Item label="Description" large value={profile.description} />
        )}
      </InfoGrid>
    </Blocks.Item>
  );
};

export default ProfileDetailsGeneralBlock;
