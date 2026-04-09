import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { UpgradeProfile } from "../../types";
import { capitalize } from "@/utils/_helpers";

interface ViewUpgradeProfileDetailsBlockProps {
  readonly profile: UpgradeProfile;
}

const ViewUpgradeProfileDetailsBlock: FC<
  ViewUpgradeProfileDetailsBlockProps
> = ({ profile }) => {
  return (
    <>
      <InfoGrid.Item
        label="Upgrade type"
        value={`${capitalize(profile.upgrade_type)} upgrades`}
      />
      <InfoGrid.Item
        label="Auto remove packages"
        value={profile.autoremove ? "On" : "Off"}
      />
    </>
  );
};

export default ViewUpgradeProfileDetailsBlock;
