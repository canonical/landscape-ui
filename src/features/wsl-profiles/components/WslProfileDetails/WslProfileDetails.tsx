import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import WslProfileAssociatedParentsLink from "../WslProfileAssociatedParentsLink";
import WslProfileCompliantParentsLink from "../WslProfileCompliantParentsLink";
import WslProfileNonCompliantParentsLink from "../WslProfileNonCompliantParentsLink";
import WslProfileRemoveModal from "../WslProfileRemoveModal";
import type { WslProfileSidePanelComponentProps } from "../WslProfileSidePanel";
import WslProfileSidePanel from "../WslProfileSidePanel";

const Component: FC<WslProfileSidePanelComponentProps> = ({
  wslProfile: profile,
  accessGroups,
  enableQuery,
  disableQuery,
}) => {
  const { pushSidePath } = usePageParams();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleWslProfileEdit = () => {
    pushSidePath("edit");
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
                  accessGroups?.find(
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
                    <WslProfileNonCompliantParentsLink
                      wslProfile={profile}
                      onClick={() => {
                        pushSidePath("noncompliant");
                      }}
                    />
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
        enableQuery={enableQuery}
        disableQuery={disableQuery}
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        wslProfile={profile}
      />
    </>
  );
};

const WslProfileDetails: FC = () => (
  <WslProfileSidePanel Component={Component} accessGroupsQueryEnabled />
);

export default WslProfileDetails;
