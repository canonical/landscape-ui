import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { WslProfile } from "../../types";

interface ViewWslProfileDetailsBlockProps {
  readonly profile: WslProfile;
}

const ViewWslProfileDetailsBlock: FC<ViewWslProfileDetailsBlockProps> = ({
  profile,
}) => {
  return (
    <>
      <InfoGrid.Item label="Rootfs image" value="From URL" />
      <InfoGrid.Item label="Image name" value={profile.image_name} />
      {profile.image_source !== null && (
        <InfoGrid.Item
          label="Image source"
          large
          value={profile.image_source}
          type="truncated"
        />
      )}
      <InfoGrid.Item
        label="Cloud init"
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
