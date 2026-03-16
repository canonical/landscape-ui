import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { WslProfile } from "@/features/profiles";

interface ViewWslProfileDetailsBlockProps {
  readonly profile: WslProfile;
}

const ViewWslProfileDetailsBlock: FC<ViewWslProfileDetailsBlockProps> = ({
  profile,
}) => {
  return (
    <>
      <InfoGrid.Item label="rootfs image" value="From URL" />
      <InfoGrid.Item label="image name" value={profile.image_name} />
      {profile.image_source !== null && (
        <InfoGrid.Item
          label="image source"
          large
          value={profile.image_source}
          type="truncated"
        />
      )}
      <InfoGrid.Item
        label="cloud init"
        large
        value={profile.cloud_init_contents}
      />
      <InfoGrid.Item
        label="Compliance settings"
        large
        value={
          profile.only_landscape_created
            ? "Uninstall WSL child instances that have not been created by Landscape"
            : "Ignore WSL child instances that have not been created by Landscape"
        }
      />
    </>
  );
};

export default ViewWslProfileDetailsBlock;
