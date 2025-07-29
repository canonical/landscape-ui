import Block from "@/components/layout/Block";
import LoadingState from "@/components/layout/LoadingState";
import Menu from "@/components/layout/Menu";
import NoData from "@/components/layout/NoData";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { ComponentProps, FC } from "react";
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

  const wslProfileMenuItems: ComponentProps<typeof Menu>["items"] = [
    {
      label: "RootFS image name",
      size: 12,
      value: profile.image_name,
    },
  ];

  if (profile.image_source) {
    wslProfileMenuItems.push({
      label: "RootFS image source",
      size: 12,
      value: profile.image_source,
      type: "truncated",
    });
  }

  wslProfileMenuItems.push({
    label: "Cloud-init",
    size: 12,
    value: profile.cloud_init_contents || <NoData />,
  });

  const associationMenuItems: ComponentProps<typeof Menu>["items"] = [
    {
      label: "Tags",
      size: 12,
      value: profile.tags.join(", "),
      type: "truncated",
    },
  ];

  if (profile.tags.length) {
    associationMenuItems.push(
      {
        label: "Associated parents",
        size: 12,
        value: <WslProfileAssociatedParentsLink wslProfile={profile} />,
      },
      {
        label: "Not compliant",
        size: 6,
        value: <WslProfileNonCompliantParentsLink wslProfile={profile} />,
      },
      {
        label: "Compliant",
        size: 6,
        value: <WslProfileCompliantParentsLink wslProfile={profile} />,
      },
    );
  }

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

      <Block>
        <Menu
          items={[
            {
              label: "Title",
              size: 6,
              value: profile.title,
            },
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
              label: "Description",
              size: 12,
              value: profile.description,
            },
          ]}
        />
      </Block>

      <Block heading>
        <Menu items={wslProfileMenuItems} />
      </Block>

      <Block heading="Association">
        {profile.all_computers ? (
          <p>This profile has been associated with all instances.</p>
        ) : (
          <Menu items={associationMenuItems} />
        )}
      </Block>

      <WslProfileRemoveModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        wslProfile={profile}
      />
    </>
  );
};

export default WslProfileDetails;
