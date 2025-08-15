import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemovalProfiles } from "../../hooks";

const RemovalProfileDetailsSidePanel: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { removalProfile: removalProfileId, setPageParams } = usePageParams();
  const { getRemovalProfilesQuery, removeRemovalProfileQuery } =
    useRemovalProfiles();

  const {
    data: getRemovalProfilesQueryResponse,
    isPending: isGettingRemovalProfiles,
    error: removalProfilesError,
  } = getRemovalProfilesQuery();
  const { mutateAsync: removeRemovalProfile, isPending: isRemoving } =
    removeRemovalProfileQuery;

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery();

  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  if (removalProfilesError) {
    throw removalProfilesError;
  }

  if (accessGroupsError) {
    throw accessGroupsError;
  }

  if (isGettingRemovalProfiles || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  const profile = getRemovalProfilesQueryResponse.data.find(
    (removalProfile) => removalProfile.id === removalProfileId,
  );

  if (!profile) {
    throw new Error("The removal profile could not be found.");
  }

  const handleRemovalProfileRemove = async () => {
    try {
      await removeRemovalProfile({ name: profile.name });

      setPageParams({ action: "", removalProfile: -1 });

      notify.success({
        title: "Removal profile removed",
        message: `Removal profile ${profile.title} has been removed`,
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleEditRemovalProfile = () => {
    setPageParams({ action: "view/edit" });
  };

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>

      <SidePanel.Content>
        <div className="p-segmented-control">
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            w
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

        <Blocks>
          <Blocks.Item>
            <InfoGrid>
              <InfoGrid.Item label="Title" value={profile.title} />

              <InfoGrid.Item label="Name" value={profile.name} />

              <InfoGrid.Item
                label="Access group"
                value={
                  accessGroupsData.data.find(
                    (accessGroup) => accessGroup.name === profile.access_group,
                  )?.title ?? profile.access_group
                }
              />

              <InfoGrid.Item
                label="Removal timeframe"
                large
                value={`${profile.days_without_exchange} ${pluralize(profile.days_without_exchange, "day")}`}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Association">
            {profile.all_computers && (
              <p>This profile has been associated with all instances.</p>
            )}

            {!profile.all_computers && !profile.tags.length && (
              <p>
                This profile has not yet been associated with any instances.
              </p>
            )}

            {!profile.all_computers && !!profile.tags.length && (
              <InfoGrid>
                <InfoGrid.Item
                  label="Tags"
                  large
                  value={profile.tags.join(", ") || null}
                  type="truncated"
                />
              </InfoGrid>
            )}
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove package profile"
        confirmationText={`remove ${profile.title}`}
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

export default RemovalProfileDetailsSidePanel;
