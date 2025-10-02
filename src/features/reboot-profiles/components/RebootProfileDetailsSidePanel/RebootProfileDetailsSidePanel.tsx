import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
import ProfileAssociation from "@/components/form/ProfileAssociation";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitle } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import useGetPageRebootProfile from "../../api/useGetPageRebootProfile";
import RebootProfileRemoveModal from "../RebootProfileRemoveModal";
import { formatWeeklyRebootSchedule } from "./helpers";

const RebootProfileDetailsSidePanel: FC = () => {
  const {
    value: modalOpen,
    setFalse: handleCloseModal,
    setTrue: handleOpenModal,
  } = useBoolean();

  const { createSidePathPusher } = usePageParams();

  const { rebootProfile: profile, isGettingRebootProfile } =
    useGetPageRebootProfile();

  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  if (isGettingRebootProfile || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const handleEditRebootProfile = createSidePathPusher("edit");

  const handleDuplicateRebootProfile = createSidePathPusher("duplicate");

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <div className="p-segmented-control">
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={handleEditRebootProfile}
            aria-label={`Edit reboot profile ${profile.title}`}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={handleDuplicateRebootProfile}
            aria-label={`Edit reboot profile ${profile.title}`}
          >
            <Icon name="canvas" />
            <span>Duplicate</span>
          </Button>
          <Button
            className="p-segmented-control__button has-icon"
            type="button"
            hasIcon
            onClick={handleOpenModal}
            aria-label={`Remove reboot profile ${profile.title}`}
          >
            <Icon name={ICONS.delete} />
            <span>Remove</span>
          </Button>
        </div>

        <Blocks>
          <Blocks.Item>
            <InfoGrid>
              <InfoGrid.Item label="Title" value={profile.title} />

              <InfoGrid.Item
                label="Access group"
                value={getTitle(profile.access_group, accessGroupsData)}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Reboot schedule">
            <InfoGrid>
              <InfoGrid.Item
                label="Schedule"
                large
                value={formatWeeklyRebootSchedule(profile)}
              />

              <InfoGrid.Item
                label="Next reboot"
                large
                value={moment(profile.next_run).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Association">
            <ProfileAssociation profile={profile}>
              <InfoGrid>
                <InfoGrid.Item
                  label="Tags"
                  large
                  value={profile.tags.join(", ")}
                  type="truncated"
                />
                <InfoGrid.Item
                  label="Associated instances"
                  large
                  value={
                    <ProfileAssociatedInstancesLink
                      profile={profile}
                      count={profile.num_computers}
                      query={`reboot:${profile.id}`}
                    />
                  }
                />
              </InfoGrid>
            </ProfileAssociation>
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>

      <RebootProfileRemoveModal
        close={handleCloseModal}
        opened={modalOpen}
        rebootProfile={profile}
      />
    </>
  );
};

export default RebootProfileDetailsSidePanel;
