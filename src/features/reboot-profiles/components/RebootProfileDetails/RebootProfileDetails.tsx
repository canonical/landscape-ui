import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Icon, ICONS } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemoveRebootProfileQuery } from "../../api";
import type { RebootProfile } from "../../types";
import RebootProfileAssociatedInstancesLink from "../RebootProfileAssociatedInstancesLink";
import { formatWeeklyRebootSchedule } from "./helpers";

const RebootProfilesForm = lazy(async () => import("../RebootProfilesForm"));

interface RebootProfileDetailsProps {
  readonly accessGroupOptions: SelectOption[];
  readonly profile: RebootProfile;
}

const RebootProfileDetails: FC<RebootProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const {
    value: modalOpen,
    setFalse: handleCloseModal,
    setTrue: handleOpenModal,
  } = useBoolean();

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfileQuery();

  const handleRemoveRebootProfile = async () => {
    try {
      await removeRebootProfile({
        id: profile.id,
      });

      closeSidePanel();

      notify.success({
        title: "Reboot profile removed",
        message: `Reboot profile ${profile.title} has been removed`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleEditRebootProfile = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <RebootProfilesForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const handleDuplicateRebootProfile = () => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <RebootProfilesForm action="duplicate" profile={profile} />
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
            <InfoGrid.Item label="Title" size={6} value={profile.title} />

            <InfoGrid.Item
              label="Access group"
              size={6}
              value={
                accessGroupOptions.find(
                  ({ value }) => value === profile.access_group,
                )?.label ?? profile.access_group
              }
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Reboot schedule">
          <InfoGrid>
            <InfoGrid.Item
              label="Schedule"
              size={12}
              value={formatWeeklyRebootSchedule(profile)}
            />

            <InfoGrid.Item
              label="Next reboot"
              size={12}
              value={moment(profile.next_run).format(DISPLAY_DATE_TIME_FORMAT)}
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Association">
          {profile.all_computers && (
            <p>This profile has been associated with all instances.</p>
          )}

          <InfoGrid>
            {!profile.all_computers && (
              <InfoGrid.Item
                label="Tags"
                size={12}
                value={profile.tags.join(", ") || null}
                type="truncated"
              />
            )}

            {(profile.all_computers || !!profile.tags.length) && (
              <InfoGrid.Item
                label="Associated instances"
                size={12}
                value={
                  <RebootProfileAssociatedInstancesLink
                    rebootProfile={profile}
                  />
                }
              />
            )}
          </InfoGrid>
        </Blocks.Item>
      </Blocks>

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

export default RebootProfileDetails;
