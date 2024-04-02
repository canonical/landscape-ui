import { FC, Suspense } from "react";
import { PackageProfile } from "@/features/package-profiles/types";
import { Button, Col, Icon, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import { usePackageProfiles } from "@/features/package-profiles/hooks";
import PackageProfileEditForm from "@/features/package-profiles/PackageProfileEditForm";
import PackageProfileDuplicateForm from "@/features/package-profiles/PackageProfileDuplicateForm";
import useNotify from "@/hooks/useNotify";
import PackageProfileDetailsConstraints from "@/features/package-profiles/PackageProfileDetailsConstraints";

interface PackageProfileDetailsProps {
  profile: PackageProfile;
}

const PackageProfileDetails: FC<PackageProfileDetailsProps> = ({ profile }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removePackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: removePackageProfile } = removePackageProfileQuery;

  const handleRemovePackageProfile = async (name: string) => {
    try {
      await removePackageProfile({ name });

      closeSidePanel();

      notify.success({
        message: `Package profile "${name}" removed successfully.`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemovePackageProfileDialog = (name: string) => {
    confirmModal({
      title: "Remove package profile",
      body: `This will remove "${name}" profile.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemovePackageProfile(name)}
          aria-label={`Remove ${name} profile`}
        >
          Remove
        </Button>,
      ],
    });
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
      <div className="p-segmented-control u-align-text--right">
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
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={() => handleRemovePackageProfileDialog(profile.name)}
        >
          <Icon name="delete" />
          <span>Remove</span>
        </Button>
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={3}>
          <InfoItem label="Name" value={profile.name} />
        </Col>
        <Col size={9}>
          <InfoItem label="Description" value={profile.description} />
        </Col>
        <Col size={3}>
          <InfoItem label="Access group" value={profile.access_group} />
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
    </>
  );
};

export default PackageProfileDetails;
