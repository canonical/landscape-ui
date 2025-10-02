import ProfileAssociation from "@/components/form/ProfileAssociation";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import InfoItem from "@/components/layout/InfoItem";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitle, pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import useGetPageUpgradeProfile from "../../api/useGetPageUpgradeProfile";
import UpgradeProfileRemoveModal from "../UpgradeProfileRemoveModal";
import { getScheduleInfo } from "./helpers";

const UpgradeProfileDetailsSidePanel: FC = () => {
  const { createSidePathPusher } = usePageParams();
  const { getAccessGroupQuery } = useRoles();

  const { upgradeProfile: profile, isGettingUpgradeProfile } =
    useGetPageUpgradeProfile();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  if (isGettingUpgradeProfile || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const { scheduleMessage, nextRunMessage } = getScheduleInfo(profile);

  const handleEditUpgradeProfile = createSidePathPusher("edit");

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <div className="p-segmented-control">
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={handleEditUpgradeProfile}
            aria-label={`Edit upgrade profile ${profile.title}`}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>
          <Button
            className="has-icon p-segmented-control__button"
            aria-label={`Remove upgrade profile ${profile.title}`}
            type="button"
            onClick={handleOpenModal}
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
                value={getTitle(profile.access_group, accessGroupsData)}
              />
              <InfoGrid.Item
                label="Upgrade type"
                value={profile.upgrade_type === "all" ? "All" : "Security"}
              />
              <InfoGrid.Item
                label="Auto remove packages"
                value={profile.autoremove ? "On" : "Off"}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Schedule">
            <InfoGrid>
              <InfoGrid.Item label="Schedule" large value={scheduleMessage} />
              <InfoGrid.Item label="Next run" large value={nextRunMessage} />
              <InfoGrid.Item
                label="Delivery delay window"
                large
                value={`${profile.deliver_delay_window} ${pluralize(
                  Number(profile.deliver_delay_window),
                  "minute",
                )}`}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Association">
            <ProfileAssociation profile={profile}>
              <InfoItem label="Tags" value={profile.tags.join(", ")} />
            </ProfileAssociation>
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      <UpgradeProfileRemoveModal
        close={handleCloseModal}
        isOpen={modalOpen}
        upgradeProfile={profile}
      />
    </>
  );
};

export default UpgradeProfileDetailsSidePanel;
