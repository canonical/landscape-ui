import { FC, lazy, Suspense } from "react";
import { Button, Col, Icon, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { useRemovalProfiles } from "@/features/removal-profiles/hooks";
import { RemovalProfile } from "@/features/removal-profiles/types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import classes from "./RemovalProfileDetails.module.scss";

const SingleRemovalProfileForm = lazy(
  () => import("@/features/removal-profiles/SingleRemovalProfileForm"),
);

interface RemovalProfileDetailsProps {
  accessGroupOptions: SelectOption[];
  profile: RemovalProfile;
}

const RemovalProfileDetails: FC<RemovalProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removeRemovalProfileQuery } = useRemovalProfiles();

  const { mutateAsync: removeRemovalProfile } = removeRemovalProfileQuery;

  const handleRemoveRemovalProfile = async () => {
    try {
      await removeRemovalProfile({ name: profile.name });

      closeSidePanel();

      notify.success({
        title: "Removal profile removed",
        message: `Removal profile ${profile.name} has been removed`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveRemovalProfileDialog = () => {
    confirmModal({
      body: `This will remove "${profile.name}" profile`,
      title: "Remove removal profile",
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={handleRemoveRemovalProfile}
          aria-label={`Remove ${profile.title}`}
        >
          Remove
        </Button>,
      ],
    });
  };

  const handleEditRemovalProfile = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleRemovalProfileForm action="edit" profile={profile} />
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
          onClick={handleEditRemovalProfile}
          aria-label={`Edit ${profile.title}`}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handleRemoveRemovalProfileDialog}
          aria-label={`Remove ${profile.title}`}
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
        <Col size={12}>
          <InfoItem
            label="Removal timeframe"
            value={`${profile.days_without_exchange} days`}
          />
        </Col>
      </Row>

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

export default RemovalProfileDetails;
