import Blocks from "@/components/layout/Blocks";
import LoadingState from "@/components/layout/LoadingState";
import Menu from "@/components/layout/Menu";
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
          <Menu>
            <Menu.Row>
              <Menu.Row.Item label="Title" size={6} value={profile.title} />
              <Menu.Row.Item label="Name" size={6} value={profile.name} />
            </Menu.Row>
            <Menu.Row>
              <Menu.Row.Item
                label="Access group"
                size={6}
                value={
                  accessGroupOptions.find(
                    ({ value }) => value === profile.access_group,
                  )?.label ?? profile.access_group
                }
              />
            </Menu.Row>
            <Menu.Row>
              <Menu.Row.Item
                label="Description"
                size={12}
                value={profile.description}
              />
            </Menu.Row>
          </Menu>
        </Blocks.Item>

        <Blocks.Item>
          <Menu>
            <Menu.Row>
              <Menu.Row.Item
                label="Rootfs image name"
                size={12}
                value={profile.image_name}
              />
            </Menu.Row>
            {profile.image_source !== null && (
              <Menu.Row>
                <Menu.Row.Item
                  label="Rootfs image source"
                  size={12}
                  value={profile.image_source}
                  type="truncated"
                />
              </Menu.Row>
            )}
            <Menu.Row>
              <Menu.Row.Item
                label="Cloud-init"
                size={12}
                value={profile.cloud_init_contents || null}
              />
            </Menu.Row>
          </Menu>
        </Blocks.Item>

        <Blocks.Item title="Association">
          <>
            {profile.all_computers && (
              <p>This profile has been associated with all instances.</p>
            )}

            <Menu>
              {!profile.all_computers && (
                <Menu.Row>
                  <Menu.Row.Item
                    label="Tags"
                    size={12}
                    value={profile.tags.join(", ") || null}
                  />
                </Menu.Row>
              )}

              {canBeAssociated && (
                <>
                  <Menu.Row>
                    <Menu.Row.Item
                      label="Associated parents"
                      size={12}
                      value={
                        <WslProfileAssociatedParentsLink wslProfile={profile} />
                      }
                    />
                  </Menu.Row>
                  <Menu.Row>
                    <Menu.Row.Item
                      label="Not compliant"
                      size={6}
                      value={
                        <WslProfileNonCompliantParentsLink
                          wslProfile={profile}
                        />
                      }
                    />
                    <Menu.Row.Item
                      label="Compliant"
                      size={6}
                      value={
                        <WslProfileCompliantParentsLink wslProfile={profile} />
                      }
                    />
                  </Menu.Row>
                </>
              )}
            </Menu>
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
