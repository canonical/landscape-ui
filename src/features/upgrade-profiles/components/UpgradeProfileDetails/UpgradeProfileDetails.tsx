import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import InfoItem from "@/components/layout/InfoItem";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useUpgradeProfiles } from "../../hooks";
import type { UpgradeProfileSidePanelComponentProps } from "../UpgradeProfileSidePanel";
import UpgradeProfileSidePanel from "../UpgradeProfileSidePanel";
import { getScheduleInfo } from "./helpers";

const Component: FC<UpgradeProfileSidePanelComponentProps> = ({
  upgradeProfile: profile,
  accessGroups,
  disableQuery,
  enableQuery,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { pushSidePath, setPageParams } = usePageParams();
  const { removeUpgradeProfileQuery } = useUpgradeProfiles();

  const { mutateAsync: removeUpgradeProfile, isPending: isRemoving } =
    removeUpgradeProfileQuery;

  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  const { scheduleMessage, nextRunMessage } = getScheduleInfo(profile);

  const handleRemoveUpgradeProfile = async () => {
    disableQuery();

    try {
      await removeUpgradeProfile({ name: profile.name });

      setPageParams({ sidePath: [], upgradeProfile: -1 });

      notify.success({
        title: "Upgrade profile removed",
        message: `Upgrade profile ${profile.title} has been removed`,
      });
    } catch (error) {
      debug(error);
      enableQuery();
    } finally {
      handleCloseModal();
    }
  };

  const handleEditUpgradeProfile = () => {
    pushSidePath("edit");
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
                value={
                  accessGroups?.find(
                    (accessGroup) => accessGroup.name === profile.access_group,
                  )?.title ?? profile.access_group
                }
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
            <>
              {profile.all_computers && (
                <p>This profile has been associated with all instances.</p>
              )}
              {!profile.all_computers && !profile.tags.length && (
                <p>
                  This profile has not yet been associated with any instances.
                </p>
              )}
              {!profile.all_computers && profile.tags.length > 0 && (
                <InfoItem
                  label="Tags"
                  value={profile.tags.join(", ") || null}
                />
              )}
            </>
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove upgrade profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemoveUpgradeProfile}
        close={handleCloseModal}
        confirmationText={`remove ${profile.title}`}
      >
        <p>
          This will remove &quot;{profile.title}&quot; upgrade profile. This
          action is <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

const UpgradeProfileDetails: FC = () => (
  <UpgradeProfileSidePanel Component={Component} accessGroupsQueryEnabled />
);

export default UpgradeProfileDetails;
