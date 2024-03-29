import { FC, lazy, Suspense } from "react";
import { Button, Col, Icon, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { useUpgradeProfiles } from "@/features/upgrade-profiles/hooks";
import { UpgradeProfile } from "@/features/upgrade-profiles/types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { getScheduleInfo } from "./helpers";
import classes from "./UpgradeProfileDetails.module.scss";

const SingleUpgradeProfileForm = lazy(
  () => import("@/features/upgrade-profiles/SingleUpgradeProfileForm"),
);

interface UpgradeProfileDetailsProps {
  accessGroupOptions: SelectOption[];
  profile: UpgradeProfile;
}

const UpgradeProfileDetails: FC<UpgradeProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removeUpgradeProfileQuery } = useUpgradeProfiles();

  const { mutateAsync: removeUpgradeProfile } = removeUpgradeProfileQuery;
  const { scheduleMessage, nextRunMessage } = getScheduleInfo(profile);

  const handleRemoveUpgradeProfile = async () => {
    try {
      await removeUpgradeProfile({ name: profile.name });

      closeSidePanel();

      notify.success({
        title: "Upgrade profile removed",
        message: `Upgrade profile ${profile.name} has been removed`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveUpgradeProfileDialog = () => {
    confirmModal({
      body: `This will remove "${profile.name}" upgrade profile`,
      title: "Remove upgrade profile",
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={handleRemoveUpgradeProfile}
        >
          Remove
        </Button>,
      ],
    });
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
          aria-label={`Edit upgrade profile ${profile.name}`}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handleRemoveUpgradeProfileDialog}
          aria-label={`Remove upgrade profile ${profile.name}`}
        >
          <Icon name="delete" />
          <span>Remove</span>
        </Button>
      </div>

      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="Name" value={profile.title} />
        </Col>
        <Col size={6}>
          <InfoItem
            label="Access group"
            value={
              accessGroupOptions.find(
                ({ value }) => value === profile.access_group,
              )?.label ?? profile.access_group
            }
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="Upgrade type"
            value={profile.upgrade_type === "all" ? "All" : "Security"}
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="Auto remove packages"
            value={profile.autoremove ? "On" : "Off"}
          />
        </Col>
      </Row>

      <div className={classes.block}>
        <p className="p-heading--5">Schedule</p>
        <div>
          <InfoItem label="Schedule" value={scheduleMessage} />
        </div>
        <div>
          <InfoItem label="Next run" value={nextRunMessage} />
        </div>
        <InfoItem
          label="Delivery delay window"
          value={`${profile.deliver_delay_window} ${profile.deliver_delay_window !== "1" ? "minutes" : "minute"}`}
        />
      </div>

      <div className={classes.block}>
        <p className="p-heading--5">Association</p>
        {profile.all_computers && (
          <p>This profile has been associated with all instances.</p>
        )}
        {!profile.all_computers && !profile.tags.length && (
          <p>This profile has not yet been associated with any instances.</p>
        )}
        {!profile.all_computers && profile.tags.length > 0 && (
          <InfoItem
            label="Tags"
            value={profile.tags.length ? profile.tags.join(", ") : "---"}
          />
        )}
      </div>
    </>
  );
};

export default UpgradeProfileDetails;
