import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { Button, Icon, ICONS } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemoveRebootProfileQuery } from "../../api";
import RebootProfileAssociatedInstancesLink from "../RebootProfileAssociatedInstancesLink";
import type { RebootProfileSidePanelComponentProps } from "../RebootProfileSidePanel";
import RebootProfileSidePanel from "../RebootProfileSidePanel";
import { formatWeeklyRebootSchedule } from "./helpers";

const Component: FC<RebootProfileSidePanelComponentProps> = ({
  rebootProfile: profile,
}) => {
  const {
    value: modalOpen,
    setFalse: handleCloseModal,
    setTrue: handleOpenModal,
  } = useBoolean();

  const debug = useDebug();
  const { notify } = useNotify();
  const { pushSidePath, setPageParams } = usePageParams();
  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfileQuery();
  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery();

  if (accessGroupsError) {
    throw accessGroupsError;
  }

  if (isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const handleRemoveRebootProfile = async () => {
    try {
      await removeRebootProfile({
        id: profile.id,
      });

      setPageParams({ sidePath: [], rebootProfile: -1 });

      notify.success({
        title: "Reboot profile removed",
        message: `Reboot profile ${profile.title} has been removed`,
      });
    } catch (error) {
      debug(error);
    }
  };

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
                  accessGroupsData.data.find(
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
      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove reboot profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        onConfirm={handleRemoveRebootProfile}
        confirmButtonDisabled={isRemovingRebootProfile}
        confirmButtonLoading={isRemovingRebootProfile}
        close={handleCloseModal}
        confirmationText={`remove ${profile.title}`}
      >
        <p>
          Are you sure you want to remove &quot;{profile.title}
          &quot; reboot profile? The removal of &quot;{profile.title}
          &quot; reboot profile is irreversible and might adversely affect your
          system.
        </p>
      </TextConfirmationModal>
    </>
  );
};

const RebootProfileDetails: FC = () => (
  <RebootProfileSidePanel Component={Component} />
);

export default RebootProfileDetails;
