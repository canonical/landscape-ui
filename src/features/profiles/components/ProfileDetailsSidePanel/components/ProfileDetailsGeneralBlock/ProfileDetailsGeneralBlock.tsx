import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import useRoles from "@/hooks/useRoles";
import { getTitleByName } from "@/utils/_helpers";
import type { FC } from "react";
import type { Profile } from "../../../../types";
import { canArchiveProfile, hasDescription, isProfileArchived } from "../../../../helpers";
import Blocks from "@/components/layout/Blocks";
import NoData from "@/components/layout/NoData/NoData";

interface ProfileDetailsGeneralBlockProps {
  readonly profile: Profile;
}

const ProfileDetailsGeneralBlock: FC<ProfileDetailsGeneralBlockProps> = ({
  profile,
}) => {
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  if (isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const status = isProfileArchived(profile) ? "Archived" : "Active";

  return (
    <Blocks.Item title="General">
      <InfoGrid>
        <InfoGrid.Item label="Name" value={profile.name} />

        {canArchiveProfile(profile) && 
          <InfoGrid.Item label="Status" value={status} />
        }
        
        <InfoGrid.Item
          label="Access group"
          value={getTitleByName(profile.access_group, accessGroupsData)}
        />

        {hasDescription(profile) && (
          <InfoGrid.Item label="Description" value={profile.description ?? <NoData />} />
        )}
      </InfoGrid>
    </Blocks.Item>
  );
};

export default ProfileDetailsGeneralBlock;
