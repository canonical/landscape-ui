import type { FC } from "react";
import { lazy, Suspense } from "react";
import type { PackageProfile } from "../../types";
import {
  Button,
  Col,
  ConfirmationButton,
  Icon,
  ICONS,
  Row,
} from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import { usePackageProfiles } from "../../hooks";
import useNotify from "@/hooks/useNotify";
import PackageProfileDetailsConstraints from "../PackageProfileDetailsConstraints";

const PackageProfileDuplicateForm = lazy(
  () => import("../PackageProfileDuplicateForm"),
);
const PackageProfileEditForm = lazy(() => import("../PackageProfileEditForm"));

interface PackageProfileDetailsProps {
  readonly profile: PackageProfile;
}

const PackageProfileDetails: FC<PackageProfileDetailsProps> = ({ profile }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removePackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: removePackageProfile, isPending: isRemoving } =
    removePackageProfileQuery;

  const handleRemovePackageProfile = async () => {
    try {
      await removePackageProfile({ name: profile.name });

      closeSidePanel();

      notify.success({
        message: `Package profile "${name}" removed successfully.`,
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
        <ConfirmationButton
          className="p-segmented-control__button has-icon"
          type="button"
          confirmationModalProps={{
            title: "Remove package profile",
            children: (
              <p>This will remove &quot;{profile.name}&quot; profile.</p>
            ),
            confirmButtonLabel: "Remove",
            confirmButtonAppearance: "negative",
            confirmButtonDisabled: isRemoving,
            confirmButtonLoading: isRemoving,
            onConfirm: handleRemovePackageProfile,
          }}
        >
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </ConfirmationButton>
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
