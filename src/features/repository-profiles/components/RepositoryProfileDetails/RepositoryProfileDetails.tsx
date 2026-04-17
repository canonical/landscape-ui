import ProfileAssociationInfo from "@/components/form/ProfileAssociationInfo";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon, ModularTable } from "@canonical/react-components";
import type { APTSource } from "@/features/apt-sources";
import type { FC } from "react";
import { Suspense, lazy } from "react";
import type { Column, CellProps } from "react-table";
import { useBoolean } from "usehooks-ts";
import { useGetProfileInstancesCount, useRepositoryProfiles } from "../../api";
import type { RepositoryProfile } from "../../types";
import Blocks from "@/components/layout/Blocks/Blocks";

const RepositoryProfileForm = lazy(async () => import("../RepositoryProfileForm"));

interface RepositoryProfileDetailsProps {
  readonly profile: RepositoryProfile;
}

const aptSourceColumns: Column<APTSource>[] = [
  {
    accessor: "name",
    Header: "Source",
  },
  {
    id: "type",
    Header: "Type",
    Cell: ({ row: { original } }: CellProps<APTSource>) =>
      original.line.startsWith("deb-src") ? "Source" : "Binary",
  },
];

const RepositoryProfileDetails: FC<RepositoryProfileDetailsProps> = ({
  profile,
}) => {
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();

  const { associatedCount, isLoadingCount } = useGetProfileInstancesCount(profile.id);

  const { removeRepositoryProfileQuery } = useRepositoryProfiles();
  const { mutateAsync: removeRepositoryProfile, isPending: isRemoving } =
    removeRepositoryProfileQuery;

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const handleEditProfile = (): void => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <RepositoryProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const handleRemoveProfile = async (): Promise<void> => {
    try {
      await removeRepositoryProfile({ name: profile.name });

      notify.success({
        title: "Repository profile removed",
        message: `Repository profile "${profile.title}" removed successfully`,
      });

      closeSidePanel();
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            type="button"
            className="p-segmented-control__button"
            onClick={handleEditProfile}
            hasIcon
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>

          <Button
            type="button"
            appearance="negative"
            className="p-segmented-control__button"
            onClick={openModal}
            hasIcon
            aria-label={`Remove ${profile.title}`}
          >
            <Icon light name="delete" />
            <span>Remove</span>
          </Button>
        </div>
      </div>

      <Blocks.Item title="General">
        <InfoGrid spaced>
          <InfoGrid.Item label="Title" large value={profile.title} />

          {profile.description && (
            <InfoGrid.Item label="Description" large value={profile.description} />
          )}

          <InfoGrid.Item label="Access group" value={profile.access_group} />

          <InfoGrid.Item
            label="All computers"
            value={profile.all_computers ? "Yes" : "No"}
          />
        </InfoGrid>
      </Blocks.Item>

      <Blocks.Item title="Sources">
        <ModularTable
          columns={aptSourceColumns}
          data={profile.apt_sources}
          emptyMsg="No sources have been added yet."
        />
      </Blocks.Item>

      <Blocks.Item title="Association">
        <ProfileAssociationInfo profile={profile}>
          <InfoGrid spaced>
            <InfoGrid.Item
              label="Tags"
              large
              value={profile.tags.join(", ")}
              type="truncated"
            />
            <InfoGrid.Item
              label="Pending"
              value={String(profile.pending_count)}
            />
          </InfoGrid>
        </ProfileAssociationInfo>
      </Blocks.Item>

      <Blocks.Item title="Instances">
        <InfoGrid spaced>
          <InfoGrid.Item
            label="Associated"
            value={isLoadingCount ? "\u2026" : String(associatedCount)}
          />
          <InfoGrid.Item
            label="Applied"
            value={isLoadingCount ? "\u2026" : String(Math.max(0, associatedCount - profile.pending_count))}
          />
          <InfoGrid.Item
            label="Pending"
            value={String(profile.pending_count)}
          />
        </InfoGrid>
      </Blocks.Item>

      <TextConfirmationModal
        isOpen={isModalOpen}
        confirmationText={`remove ${profile.title}`}
        title="Remove repository profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemoveProfile}
        close={closeModal}
      >
        <p>
          This will remove &quot;{profile.title}&quot; profile. This action is{" "}
          <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default RepositoryProfileDetails;
