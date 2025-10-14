import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
import ProfileAssociationInfo from "@/components/form/ProfileAssociationInfo";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitleByName } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import useGetPageWslProfile from "../../api/useGetPageWslProfile";
import WslProfileNonCompliantParentsLink from "../WslProfileNonCompliantParentsLink";
import WslProfileRemoveModal from "../WslProfileRemoveModal";

const WslProfileDetailsSidePanel: FC = () => {
  const { createSidePathPusher } = usePageParams();
  const { getAccessGroupQuery } = useRoles();

  const { wslProfile: profile, isGettingWslProfile: isGettingUpgradeProfile } =
    useGetPageWslProfile();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  if (isGettingUpgradeProfile || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const handleWslProfileEdit = createSidePathPusher("edit");

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <div className="p-segmented-control">
          <div className="p-segmented-control__list">
            <Button
              type="button"
              hasIcon
              className="p-segmented-control__button"
              onClick={handleWslProfileEdit}
            >
              <Icon name="edit" />
              <span>Edit</span>
            </Button>

            <Button
              type="button"
              hasIcon
              className="p-segmented-control__button"
              aria-label={`Remove ${profile.title} profile`}
              onClick={openRemoveModal}
            >
              <Icon name={ICONS.delete} />
              <span>Remove</span>
            </Button>
          </div>
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
                label="Description"
                large
                value={profile.description}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item>
            <InfoGrid>
              <InfoGrid.Item
                label="Rootfs image name"
                large
                value={profile.image_name}
              />
              {profile.image_source !== null && (
                <InfoGrid.Item
                  label="Rootfs image source"
                  large
                  value={profile.image_source}
                  type="truncated"
                />
              )}
              <InfoGrid.Item
                label="Cloud-init"
                large
                value={profile.cloud_init_contents}
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
                <InfoGrid.Item
                  label="Associated parents"
                  large
                  value={
                    <ProfileAssociatedInstancesLink
                      count={profile.computers.constrained.length}
                      profile={profile}
                      query={`wsl:${profile.id}`}
                    />
                  }
                />
                <InfoGrid.Item
                  label="Not compliant"
                  value={
                    <WslProfileNonCompliantParentsLink
                      wslProfile={profile}
                      onClick={createSidePathPusher("noncompliant")}
                    />
                  }
                />
                <InfoGrid.Item
                  label="Compliant"
                  value={
                    <ProfileAssociatedInstancesLink
                      profile={profile}
                      count={
                        profile.computers.constrained.length -
                        profile.computers["non-compliant"].length
                      }
                      query={`wsl:${profile.id}:compliant`}
                    />
                  }
                />
              </InfoGrid>
            </ProfileAssociationInfo>
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      <WslProfileRemoveModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        wslProfile={profile}
      />
    </>
  );
};

export default WslProfileDetailsSidePanel;
