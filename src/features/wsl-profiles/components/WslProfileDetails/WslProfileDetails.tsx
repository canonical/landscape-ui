import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import type { WslProfile } from "../../types";
import WslProfileAssociatedParentsLink from "../WslProfileAssociatedParentsLink";
import WslProfileCompliantParentsLink from "../WslProfileCompliantParentsLink";
import WslProfileNonCompliantParentsLink from "../WslProfileNonCompliantParentsLink";
import WslProfileRemoveModal from "../WslProfileRemoveModal";

const WslProfileEditForm = lazy(async () => import("../WslProfileEditForm"));

interface WslProfileDetailsProps {
  readonly profile: WslProfile;
  readonly accessGroupOptions: SelectOption[];
}

const WslProfileDetails: FC<WslProfileDetailsProps> = ({
  profile,
  accessGroupOptions,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleWslProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const canBeAssociated = profile.all_computers || !!profile.tags.length;

  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={handleWslProfileEdit}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>

          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            aria-label={`Remove ${profile.title} profile`}
            onClick={openRemoveModal}
          >
            <Icon name={ICONS.delete} />
            <span>Remove</span>
          </Button>
        </div>
      </div>

      <Blocks>
        <Blocks.Item>
          <InfoGrid>
            <InfoGrid.Item label="Title" size={6} value={profile.title} />
            <InfoGrid.Item label="Name" size={6} value={profile.name} />
            <InfoGrid.Item
              label="Access group"
              size={6}
              value={
                accessGroupOptions.find(
                  ({ value }) => value === profile.access_group,
                )?.label ?? profile.access_group
              }
            />
            <InfoGrid.Item
              label="Description"
              size={12}
              value={profile.description}
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item>
          <InfoGrid>
            <InfoGrid.Item
              label="Rootfs image name"
              size={12}
              value={profile.image_name}
            />
            {profile.image_source !== null && (
              <InfoGrid.Item
                label="Rootfs image source"
                size={12}
                value={profile.image_source}
                type="truncated"
              />
            )}
            <InfoGrid.Item
              label="Cloud-init"
              size={12}
              value={profile.cloud_init_contents || null}
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Association">
          <>
            {profile.all_computers && (
              <p>This profile has been associated with all instances.</p>
            )}

            <InfoGrid>
              {!profile.all_computers && (
                <InfoGrid.Item
                  label="Tags"
                  size={12}
                  value={profile.tags.join(", ") || null}
                />
              )}

              {canBeAssociated && (
                <>
                  <InfoGrid.Item
                    label="Associated parents"
                    size={12}
                    value={
                      <WslProfileAssociatedParentsLink wslProfile={profile} />
                    }
                  />
                  <InfoGrid.Item
                    label="Not compliant"
                    size={6}
                    value={
                      <WslProfileNonCompliantParentsLink wslProfile={profile} />
                    }
                  />
                  <InfoGrid.Item
                    label="Compliant"
                    size={6}
                    value={
                      <WslProfileCompliantParentsLink wslProfile={profile} />
                    }
                  />
                </>
              )}
            </InfoGrid>
          </>
        </Blocks.Item>
      </Blocks>

      <WslProfileRemoveModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        wslProfile={profile}
      />
    </>
  );
};

export default WslProfileDetails;
