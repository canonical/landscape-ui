import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import { LocalSidePanelHeader } from "@/components/layout/LocalSidePanel";
import useDebug from "@/hooks/useDebug";
import useNavigateWithSearch from "@/hooks/useNavigateWithSearch";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import type { UrlParams } from "@/types/UrlParams";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS, SidePanel } from "@canonical/react-components";
import type { FC } from "react";
import { useParams } from "react-router";
import { useBoolean } from "usehooks-ts";
import { usePackageProfiles } from "../../hooks";
import PackageProfileAssociatedInstancesLink from "../PackageProfileAssociatedInstancesLink";
import PackageProfileDetailsConstraints from "../PackageProfileDetailsConstraints";

const PackageProfileDetails: FC = () => {
  const debug = useDebug();
  const navigateWithSearch = useNavigateWithSearch();
  const { notify } = useNotify();
  const { packageProfileName } = useParams<UrlParams>();
  const { getPackageProfilesQuery, removePackageProfileQuery } =
    usePackageProfiles();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsData } = getAccessGroupQuery();
  const accessGroups = accessGroupsData?.data ?? [];

  const { mutateAsync: removePackageProfile, isPending: isRemoving } =
    removePackageProfileQuery;
  const {
    data: getPackageProfilesQueryResponse,
    isPending: isPendingPackageProfiles,
  } = getPackageProfilesQuery(
    { names: [packageProfileName as string] },
    { enabled: !!packageProfileName },
  );

  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  if (isPendingPackageProfiles) {
    return (
      <>
        <LocalSidePanelHeader root=".." />

        <SidePanel.Content>
          <LoadingState />
        </SidePanel.Content>
      </>
    );
  }

  const profile = getPackageProfilesQueryResponse?.data.result[0];

  if (!profile) {
    throw new Error("The package profile could not be found.");
  }

  const handleRemovePackageProfile = async () => {
    try {
      await removePackageProfile({ name: profile.name });

      navigateWithSearch("..");

      notify.success({
        message: `Package profile "${profile.name}" removed successfully.`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handlePackageProfileEdit = () => {
    navigateWithSearch(`../edit${packageProfileName}`);
  };

  const handlePackageProfileDuplicate = () => {
    navigateWithSearch(`../duplicate/${packageProfileName}`);
  };

  return (
    <>
      <LocalSidePanelHeader root=".." title={profile.title} />

      <SidePanel.Content>
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
      </SidePanel.Content>

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
