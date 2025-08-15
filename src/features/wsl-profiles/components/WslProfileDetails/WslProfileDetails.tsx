import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useGetWslProfile } from "../../api";
import WslProfileAssociatedParentsLink from "../WslProfileAssociatedParentsLink";
import WslProfileCompliantParentsLink from "../WslProfileCompliantParentsLink";
import WslProfileNonCompliantParentsLink from "../WslProfileNonCompliantParentsLink";
import WslProfileRemoveModal from "../WslProfileRemoveModal";

const WslProfileDetails: FC = () => {
  const { wslProfile: wslProfileName, setPageParams } = usePageParams();

  const { getAccessGroupQuery } = useRoles();

  const {
    wslProfile: profile,
    isGettingWslProfile,
    wslProfileError,
  } = useGetWslProfile({ profile_name: wslProfileName });
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  if (accessGroupsError) {
    throw accessGroupsError;
  }

  if (isGettingWslProfile || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  if (!profile) {
    throw wslProfileError;
  }

  const handleWslProfileEdit = () => {
    setPageParams({ action: "view/edit" });
  };

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
                value={
                  accessGroupsData.data.find(
                    (accessGroup) => accessGroup.name === profile.access_group,
                  )?.title ?? profile.access_group
                }
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
                value={profile.cloud_init_contents || null}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Association">
            {profile.all_computers && (
              <p>This profile has been associated with all instances.</p>
            )}

            {!profile.all_computers && !profile.tags.length && (
              <p>
                This profile has not yet been associated with any instances.
              </p>
            )}

            {(profile.all_computers || !!profile.tags.length) && (
              <InfoGrid>
                {!profile.all_computers && (
                  <InfoGrid.Item
                    label="Tags"
                    large
                    value={profile.tags.join(", ") || null}
                    type="truncated"
                  />
                )}

                <InfoGrid.Item
                  label="Associated parents"
                  large
                  value={
                    <WslProfileAssociatedParentsLink wslProfile={profile} />
                  }
                />
                <InfoGrid.Item
                  label="Not compliant"
                  value={
                    <WslProfileNonCompliantParentsLink wslProfile={profile} />
                  }
                />
                <InfoGrid.Item
                  label="Compliant"
                  value={
                    <WslProfileCompliantParentsLink wslProfile={profile} />
                  }
                />
              </InfoGrid>
            )}
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

export default WslProfileDetails;
