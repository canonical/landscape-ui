import type { FC } from "react";
import type { Profile } from "../../../../types";
import {
  isRemovalProfile,
  isScriptProfile,
  isSecurityProfile,
  isUpgradeProfile,
  isWslProfile
} from "../../../../helpers";
import InfoGrid from "@/components/layout/InfoGrid/InfoGrid";
import Blocks from "@/components/layout/Blocks";
import { ViewRemovalProfileDetailsBlock } from "@/features/removal-profiles";
import { ViewScriptProfileDetailsBlock } from "@/features/script-profiles";
import { ViewSecurityProfileDetailsBlock } from "@/features/security-profiles";
import { ViewUpgradeProfileDetailsBlock } from "@/features/upgrade-profiles";
import { ViewWslProfileDetailsBlock } from "@/features/wsl-profiles";

interface ViewProfileDetailsBlockProps {
  readonly profile: Profile;
}

const ViewProfileDetailsBlock: FC<ViewProfileDetailsBlockProps> = ({
  profile,
}) => {
  const getProfileDetailsBlock = (() => {
    if (isRemovalProfile(profile)) {
      return <ViewRemovalProfileDetailsBlock profile={profile} />;
    }

    if (isScriptProfile(profile)) {
      return <ViewScriptProfileDetailsBlock profile={profile} />;
    }

    if (isSecurityProfile(profile)) {
      return <ViewSecurityProfileDetailsBlock profile={profile} />;
    }

    if (isUpgradeProfile(profile)) {
      return <ViewUpgradeProfileDetailsBlock profile={profile} />;
    }

    if (isWslProfile(profile)) {
      return <ViewWslProfileDetailsBlock profile={profile} />;
    }
    return;
  })();

  if (getProfileDetailsBlock) {
    return (
      <Blocks.Item title="DETAILS">
        <InfoGrid dense>
          {getProfileDetailsBlock}
        </InfoGrid>
      </Blocks.Item>
    );
  }
  return;
};

export default ViewProfileDetailsBlock;
