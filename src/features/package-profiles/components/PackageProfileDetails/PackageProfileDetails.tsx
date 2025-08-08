import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";
import PackageProfileAssociatedInstancesLink from "../PackageProfileAssociatedInstancesLink";
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
      handleCloseModal();
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
          className="p-segmented-control__button u-no-margin"
          onClick={handlePackageProfileDuplicate}
        >
          <Icon name="canvas" />
          <span>Duplicate profile</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button u-no-margin"
          onClick={handlePackageProfileEdit}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <Button
          className="p-segmented-control__button u-no-margin"
          hasIcon
          type="button"
          onClick={handleOpenModal}
          aria-label={`Remove ${profile.title} package profile`}
        >
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </Button>
      </div>

      <InfoGrid spaced>
        <InfoGrid.Item label="Title" value={profile.title} />

        <InfoGrid.Item label="Name" value={profile.name} />

        <InfoGrid.Item label="Description" value={profile.description} />

        <InfoGrid.Item
          label="Access group"
          value={
            accessGroups.find((group) => group.name === profile.access_group)
              ?.title ?? profile.access_group
          }
        />

        <InfoGrid.Item
          label="Tags"
          large
          value={profile.tags.join(", ") || null}
          type="truncated"
        />

        <InfoGrid.Item
          label="Associated to"
          value={
            <PackageProfileAssociatedInstancesLink packageProfile={profile} />
          }
        />

        <InfoGrid.Item
          label="Pending on"
          value={`${profile.computers.pending?.length ?? 0} ${pluralize(
            profile.computers.pending.length,
            "instance",
          )}`}
        />

        <InfoGrid.Item
          label="Not compliant on"
          value={`${profile.computers["non-compliant"].length} ${pluralize(
            profile.computers["non-compliant"].length,
            "instance",
          )}`}
        />
      </InfoGrid>

      <PackageProfileDetailsConstraints profile={profile} />

      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove package profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonLoading={isRemoving}
        confirmButtonDisabled={isRemoving}
        close={handleCloseModal}
        confirmationText={`remove ${profile.title}`}
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
