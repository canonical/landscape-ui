import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useUpgradeProfiles } from "../../hooks";
import type { UpgradeProfile } from "../../types";
import { getScheduleInfo } from "./helpers";

const SingleUpgradeProfileForm = lazy(
  async () => import("../SingleUpgradeProfileForm"),
);

interface UpgradeProfileDetailsProps {
  readonly accessGroupOptions: SelectOption[];
  readonly profile: UpgradeProfile;
}

const UpgradeProfileDetails: FC<UpgradeProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeUpgradeProfileQuery } = useUpgradeProfiles();

  const { mutateAsync: removeUpgradeProfile, isPending: isRemoving } =
    removeUpgradeProfileQuery;
  const { scheduleMessage, nextRunMessage } = getScheduleInfo(profile);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemoveUpgradeProfile = async () => {
    try {
      await removeUpgradeProfile({ name: profile.name });

      handleCloseModal();
      closeSidePanel();

      notify.success({
        title: "Upgrade profile removed",
        message: `Upgrade profile ${profile.title} has been removed`,
      });
    } catch (error) {
      handleCloseModal();
      debug(error);
    }
  };

  const handleEditUpgradeProfile = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleUpgradeProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  return (
    <>
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
                accessGroupOptions.find(
                  ({ value }) => value === profile.access_group,
                )?.label ?? profile.access_group
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
              <InfoItem label="Tags" value={profile.tags.join(", ") || null} />
            )}
          </>
        </Blocks.Item>
      </Blocks>

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

export default UpgradeProfileDetails;
