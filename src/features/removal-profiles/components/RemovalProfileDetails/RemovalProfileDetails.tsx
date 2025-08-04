import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import LoadingState from "@/components/layout/LoadingState";
import Menu from "@/components/layout/Menu";
import NoData from "@/components/layout/NoData";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useRemovalProfiles } from "../../hooks";
import type { RemovalProfile } from "../../types";

const SingleRemovalProfileForm = lazy(
  async () => import("../SingleRemovalProfileForm"),
);

interface RemovalProfileDetailsProps {
  readonly accessGroupOptions: SelectOption[];
  readonly profile: RemovalProfile;
}

const RemovalProfileDetails: FC<RemovalProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeRemovalProfileQuery } = useRemovalProfiles();

  const { mutateAsync: removeRemovalProfile, isPending: isRemoving } =
    removeRemovalProfileQuery;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemovalProfileRemove = async () => {
    try {
      await removeRemovalProfile({ name: profile.name });

      handleCloseModal();
      closeSidePanel();

      notify.success({
        title: "Removal profile removed",
        message: `Removal profile ${profile.title} has been removed`,
      });
    } catch (error) {
      handleCloseModal();
      debug(error);
    }
  };

  const handleEditRemovalProfile = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleRemovalProfileForm action="edit" profile={profile} />
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

      <Blocks
        items={[
          {
            content: (
              <Menu
                items={[
                  { label: "Title", size: 6, value: profile.title },
                  {
                    label: "Name",
                    size: 6,
                    value: profile.name,
                  },
                  {
                    label: "Access group",
                    size: 6,
                    value:
                      accessGroupOptions.find(
                        ({ value }) => value === profile.access_group,
                      )?.label ?? profile.access_group,
                  },
                  {
                    label: "Removal timeframe",
                    size: 12,
                    value: `${profile.days_without_exchange} ${pluralize(profile.days_without_exchange, "day")}`,
                  },
                ]}
              />
            ),
          },
          {
            title: "Assocation",
            content: (
              <>
                {profile.all_computers ? (
                  <p>This profile has been associated with all instances.</p>
                ) : (
                  <Menu
                    items={[
                      {
                        label: "Tags",
                        size: 12,
                        value: profile.tags.join(", ") || <NoData />,
                        type: "truncated",
                      },
                    ]}
                  />
                )}
              </>
            ),
          },
        ]}
      />

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

export default RemovalProfileDetails;
