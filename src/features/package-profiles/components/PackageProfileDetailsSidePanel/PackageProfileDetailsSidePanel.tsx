import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitleByName, pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import useGetPagePackageProfile from "../../api/useGetPagePackageProfile";
import PackageProfileDetailsConstraints from "../PackageProfileDetailsConstraints";
import PackageProfileRemoveModal from "../PackageProfileRemoveModal";

const PackageProfileDetailsSidePanel: FC = () => {
  const { createSidePathPusher } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  const { packageProfile: profile, isGettingPackageProfile } =
    useGetPagePackageProfile();

  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  if (isGettingPackageProfile || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const handlePackageProfileEdit = createSidePathPusher("edit");

  const handlePackageProfileDuplicate = createSidePathPusher("duplicate");

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
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
            value={getTitleByName(profile.access_group, accessGroupsData)}
          />

          <InfoGrid.Item
            label="Tags"
            large
            value={profile.tags.join(", ")}
            type="truncated"
          />

          <InfoGrid.Item
            label="Associated to"
            value={
              <ProfileAssociatedInstancesLink
                profile={profile}
                count={profile.computers.constrained.length}
                query={`package:${profile.id}`}
              />
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

      <PackageProfileRemoveModal
        close={handleCloseModal}
        isOpen={modalOpen}
        packageProfile={profile}
      />
    </>
  );
};

export default PackageProfileDetailsSidePanel;
