import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Col, Icon, ICONS, Row } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { usePackageProfiles } from "../../hooks";
import useRoles from "@/hooks/useRoles";
import type { PackageProfile } from "../../types";
import PackageProfileDetailsConstraints from "../PackageProfileDetailsConstraints";

const PackageProfileDuplicateForm = lazy(
  async () => import("../PackageProfileDuplicateForm"),
);
const PackageProfileEditForm = lazy(
  async () => import("../PackageProfileEditForm"),
);

interface PackageProfileDetailsProps {
  readonly profile: PackageProfile;
}

const PackageProfileDetails: FC<PackageProfileDetailsProps> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removePackageProfileQuery } = usePackageProfiles();

  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsData } = getAccessGroupQuery();
  const accessGroups = accessGroupsData?.data ?? [];

  const { mutateAsync: removePackageProfile, isPending: isRemoving } =
    removePackageProfileQuery;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemovePackageProfile = async () => {
    try {
      await removePackageProfile({ name: profile.name });

      handleCloseModal();
      closeSidePanel();

      notify.success({
        message: `Package profile "${profile.name}" removed successfully.`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handlePackageProfileEdit = () => {
    setSidePanelContent(
      "Edit package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handlePackageProfileDuplicate = () => {
    setSidePanelContent(
      "Duplicate package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileDuplicateForm profile={profile} />
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
          onClick={handlePackageProfileDuplicate}
        >
          <Icon name="canvas" />
          <span>Duplicate profile</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handlePackageProfileEdit}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <Button
          className="p-segmented-control__button"
          hasIcon
          type="button"
          onClick={handleOpenModal}
          aria-label={`Remove ${profile.title} package profile`}
        >
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </Button>
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={3}>
          <InfoItem label="Name" value={profile.title} />
        </Col>
        <Col size={9}>
          <InfoItem label="Description" value={profile.description} />
        </Col>
        <Col size={3}>
          <InfoItem
            label="Access group"
            value={
              accessGroups.find((group) => group.name === profile.access_group)
                ?.title ?? profile.access_group
            }
          />
        </Col>
        <Col size={9}>
          <InfoItem label="Tags" value={profile.tags.join(", ")} />
        </Col>
        <Col size={3}>
          <InfoItem
            label="Associated to"
            value={`${profile.computers.constrained.length} instances`}
          />
        </Col>
        <Col size={3}>
          <InfoItem
            label="Pending on"
            value={`${profile.computers.pending?.length ?? 0} instances`}
          />
        </Col>
        <Col size={3}>
          <InfoItem
            label="Not compliant on"
            value={`${profile.computers["non-compliant"].length} instances`}
          />
        </Col>
      </Row>

      <PackageProfileDetailsConstraints profile={profile} />

      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove package profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonLoading={isRemoving}
        confirmButtonDisabled={isRemoving}
        close={handleCloseModal}
        confirmationText={`remove ${profile.name}`}
        onConfirm={handleRemovePackageProfile}
      >
        <p>
          This will remove &quot;{profile.title}&quot; profile. This action is{" "}
          <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default PackageProfileDetails;
