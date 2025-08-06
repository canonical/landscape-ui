import Blocks from "@/components/layout/Blocks";
import Grid from "@/components/layout/Grid";
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
          <Grid>
            <Grid.Item label="Title" size={6} value={profile.title} />
            <Grid.Item label="Name" size={6} value={profile.name} />
            <Grid.Item
              label="Access group"
              size={6}
              value={
                accessGroupOptions.find(
                  ({ value }) => value === profile.access_group,
                )?.label ?? profile.access_group
              }
            />
            <Grid.Item
              label="Description"
              size={12}
              value={profile.description}
            />
          </Grid>
        </Blocks.Item>

        <Blocks.Item>
          <Grid>
            <Grid.Item
              label="Rootfs image name"
              size={12}
              value={profile.image_name}
            />
            {profile.image_source !== null && (
              <Grid.Item
                label="Rootfs image source"
                size={12}
                value={profile.image_source}
                type="truncated"
              />
            )}
            <Grid.Item
              label="Cloud-init"
              size={12}
              value={profile.cloud_init_contents || null}
            />
          </Grid>
        </Blocks.Item>

        <Blocks.Item title="Association">
          <>
            {profile.all_computers && (
              <p>This profile has been associated with all instances.</p>
            )}

            <Grid>
              {!profile.all_computers && (
                <Grid.Item
                  label="Tags"
                  size={12}
                  value={profile.tags.join(", ") || null}
                />
              )}

              {canBeAssociated && (
                <>
                  <Grid.Item
                    label="Associated parents"
                    size={12}
                    value={
                      <WslProfileAssociatedParentsLink wslProfile={profile} />
                    }
                  />
                  <Grid.Item
                    label="Not compliant"
                    size={6}
                    value={
                      <WslProfileNonCompliantParentsLink wslProfile={profile} />
                    }
                  />
                  <Grid.Item
                    label="Compliant"
                    size={6}
                    value={
                      <WslProfileCompliantParentsLink wslProfile={profile} />
                    }
                  />
                </>
              )}
            </Grid>
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
