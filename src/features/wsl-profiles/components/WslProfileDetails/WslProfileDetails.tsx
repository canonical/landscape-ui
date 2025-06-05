import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Col, Icon, ICONS, Row } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useWslProfiles } from "../../hooks";
import type { WslProfile } from "../../types";
import classes from "./WslProfileDetails.module.scss";
import { pluralize } from "@/utils/_helpers";

const WslProfileEditForm = lazy(async () => import("../WslProfileEditForm"));
const WslProfileInstallForm = lazy(
  async () => import("../WslProfileInstallForm"),
);

interface WslProfileDetailsProps {
  readonly profile: WslProfile;
  readonly accessGroupOptions: SelectOption[];
}

const WslProfileDetails: FC<WslProfileDetailsProps> = ({
  profile,
  accessGroupOptions,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeWslProfileQuery } = useWslProfiles();

  const { mutateAsync: removeWslProfile, isPending: isRemoving } =
    removeWslProfileQuery;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemoveWslProfile = async () => {
    try {
      await removeWslProfile({ name: profile.name });

      handleCloseModal();
      closeSidePanel();

      notify.success({
        message: `WSL profile "${profile.title}" removed successfully.`,
        title: "WSL profile removed",
      });
    } catch (error) {
      handleCloseModal();
      debug(error);
    }
  };

  const handleWslProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handleWslProfileDuplicate = () => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileInstallForm action="duplicate" profile={profile} />
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
          onClick={handleWslProfileEdit}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handleWslProfileDuplicate}
        >
          <Icon name="canvas" />
          <span>Duplicate</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          aria-label={`Remove ${profile.title} profile`}
          onClick={handleOpenModal}
        >
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </Button>
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="name" value={profile.title} />
        </Col>
        <Col size={6}>
          <InfoItem
            label="access group"
            value={
              accessGroupOptions.find(
                ({ value }) => value === profile.access_group,
              )?.label ?? profile.access_group
            }
          />
        </Col>
        <InfoItem label="description" value={profile.description} />
        <div className={classes.block}>
          <InfoItem label="rootfs image name" value={profile.image_name} />
          {profile.image_source && (
            <InfoItem
              type="truncated"
              label="rootfs image source"
              value={profile.image_source}
            />
          )}
          <InfoItem
            label="cloud init"
            value={profile.cloud_init_contents || "N/A"}
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
            <InfoItem label="tags" value={profile.tags.join(", ")} />
          )}
        </div>

        <Col size={12}>
          <InfoItem
            label="associated"
            value={`${profile.computers.constrained.length} ${pluralize(profile.computers.constrained.length, "instance")}`}
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="not compliant"
            value={`${profile.computers["non-compliant"].length} ${pluralize(profile.computers["non-compliant"].length, "instance")}`}
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="pending"
            value={`${profile.computers.pending?.length ?? 0} ${pluralize(profile.computers.pending.length, "instance")}`}
          />
        </Col>
      </Row>

      <TextConfirmationModal
        isOpen={modalOpen}
        close={handleCloseModal}
        onConfirm={handleRemoveWslProfile}
        title="Remove WSL profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        confirmationText={`remove ${profile.name}`}
      >
        <p>
          Removing this profile will affect{" "}
          <b>{profile.computers.constrained.length} instances</b>. This action
          is <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default WslProfileDetails;
