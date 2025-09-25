import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { Button, Icon, ICONS } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import useGetPageRebootProfile from "../../api/useGetPageRebootProfile";
import RebootProfileAssociatedInstancesLink from "../RebootProfileAssociatedInstancesLink";
import RebootProfileRemoveModal from "../RebootProfileRemoveModal";
import { formatWeeklyRebootSchedule } from "./helpers";

const RebootProfileDetailsSidePanel: FC = () => {
  const {
    value: modalOpen,
    setFalse: handleCloseModal,
    setTrue: handleOpenModal,
  } = useBoolean();

  const { pushSidePath } = usePageParams();

  const { rebootProfile: profile, isGettingRebootProfile } =
    useGetPageRebootProfile();

  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  if (isGettingRebootProfile || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const handleEditRebootProfile = () => {
    pushSidePath("edit");
  };

  const handleDuplicateRebootProfile = () => {
    pushSidePath("duplicate");
  };

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
                value={
                  accessGroupsData?.data.find(
                    (accessGroup) => accessGroup.name === profile.access_group,
                  )?.title ?? profile.access_group
                }
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
                  label="Associated instances"
                  large
                  value={
                    <RebootProfileAssociatedInstancesLink
                      rebootProfile={profile}
                    />
                  }
                />
              </InfoGrid>
            )}
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
