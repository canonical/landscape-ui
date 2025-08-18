import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemovalProfiles } from "../../hooks";
import RemovalProfileSidePanel from "../RemovalProfileSidePanel";
import type { RemovalProfileSidePanelComponentProps } from "../RemovalProfileSidePanel/RemovalProfileSidePanel";

const Component: FC<RemovalProfileSidePanelComponentProps> = ({
  removalProfile: profile,
  accessGroups,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { pushSidePath, setPageParams } = usePageParams();
  const { removeRemovalProfileQuery } = useRemovalProfiles();

  const { mutateAsync: removeRemovalProfile, isPending: isRemoving } =
    removeRemovalProfileQuery;

  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  const handleRemovalProfileRemove = async () => {
    try {
      await removeRemovalProfile({ name: profile.name });

      setPageParams({ sidePath: [], removalProfile: -1 });

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
    pushSidePath("edit");
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
                  accessGroups?.find(
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

const RemovalProfileDetailsForm: FC = () => (
  <RemovalProfileSidePanel Component={Component} accessGroupsQueryEnabled />
);

export default RemovalProfileDetailsForm;
