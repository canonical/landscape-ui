import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { Button, Col, Icon, ICONS, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { useRemovalProfiles } from "../../hooks";
import type { RemovalProfile } from "../../types";
import classes from "./RemovalProfileDetails.module.scss";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";

const SingleRemovalProfileForm = lazy(
  async () => import("../SingleRemovalProfileForm"),
);

interface RemovalProfileDetailsProps {
  readonly accessGroupOptions: SelectOption[];
  readonly profile: RemovalProfile;
}

const RemovalProfileDetails: FC<RemovalProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeRemovalProfileQuery } = useRemovalProfiles();

  const { mutateAsync: removeRemovalProfile, isPending: isRemoving } =
    removeRemovalProfileQuery;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemovalProfileRemove = async () => {
    try {
      await removeRemovalProfile({ name: profile.name });

      handleCloseModal();
      closeSidePanel();

      notify.success({
        title: "Removal profile removed",
        message: `Removal profile ${profile.title} has been removed`,
      });
    } catch (error) {
      handleCloseModal();
      debug(error);
    }
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
          className="p-segmented-control__button"
          hasIcon
          type="button"
          onClick={handleOpenModal}
          aria-label={`Remove ${profile.title}`}
        >
          <Icon name={ICONS.delete} />
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
            type="truncated"
            value={profile.tags.join(", ")}
          />
        )}
      </div>

      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove package profile"
        confirmationText={`remove ${profile.name}`}
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemovalProfileRemove}
        close={handleCloseModal}
      >
        <p>
          This will remove &quot;{profile.title}&quot; profile. This action is{" "}
          <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default RemovalProfileDetails;
