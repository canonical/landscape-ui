import ProfileAssociationInfo from "@/components/form/ProfileAssociationInfo";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitleByName, pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import useGetPageRemovalProfile from "../../api/useGetPageRemovalProfile";
import RemovalProfileRemoveModal from "../RemovalProfileRemoveModal";

const RemovalProfileDetails: FC = () => {
  const { createSidePathPusher } = usePageParams();
  const { getAccessGroupQuery } = useRoles();

  const { removalProfile: profile, isGettingRemovalProfile } =
    useGetPageRemovalProfile();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  if (isGettingRemovalProfile || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const handleEditRemovalProfile = createSidePathPusher("edit");

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <div className="p-segmented-control">
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={handleEditRemovalProfile}
            aria-label={`Edit ${profile.title}`}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>
          <Button
            className="p-segmented-control__button"
            hasIcon
            type="button"
            onClick={handleOpenModal}
            aria-label={`Remove ${profile.title}`}
          >
            <Icon name={ICONS.delete} />
            <span>Remove</span>
          </Button>
        </div>

        <Blocks>
          <Blocks.Item>
            <InfoGrid>
              <InfoGrid.Item label="Title" value={profile.title} />

              <InfoGrid.Item label="Name" value={profile.name} />

              <InfoGrid.Item
                label="Access group"
                value={getTitleByName(profile.access_group, accessGroupsData)}
              />

              <InfoGrid.Item
                label="Removal timeframe"
                large
                value={`${profile.days_without_exchange} ${pluralize(profile.days_without_exchange, "day")}`}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Association">
            <ProfileAssociationInfo profile={profile}>
              <InfoGrid>
                <InfoGrid.Item
                  label="Tags"
                  large
                  value={profile.tags.join(", ")}
                  type="truncated"
                />
              </InfoGrid>
            </ProfileAssociationInfo>
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>

      <RemovalProfileRemoveModal
        close={handleCloseModal}
        isOpen={modalOpen}
        removalProfile={profile}
      />
    </>
  );
};

export default RemovalProfileDetails;
