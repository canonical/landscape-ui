import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import useRoles from "@/hooks/useRoles";
import { getTitleByName } from "@/utils/_helpers";
import type { FC } from "react";
import type { Profile } from "../../../../types";
import {
  canArchiveProfile,
  hasDescription,
  isProfileArchived,
  type ProfileTypes,
} from "../../../../helpers";
import Blocks from "@/components/layout/Blocks";

interface ViewProfileGeneralBlockProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
}

const ViewProfileGeneralBlock: FC<ViewProfileGeneralBlockProps> = ({
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
    <Blocks.Item title="General" titleClassName="p-text--small-caps">
      <InfoGrid dense>
        <InfoGrid.Item label="Name" value={profile.title} />

        {canArchiveProfile(type) && (
          <InfoGrid.Item label="Status" value={status} />
        )}

        <InfoGrid.Item
          label="Access group"
          value={getTitleByName(profile.access_group, accessGroupsData)}
        />

        {hasDescription(type) && (
          <InfoGrid.Item
            label="Description"
            large
            value={profile.description}
          />
        )}
      </InfoGrid>
    </Blocks.Item>
  );
};

export default ViewProfileGeneralBlock;
