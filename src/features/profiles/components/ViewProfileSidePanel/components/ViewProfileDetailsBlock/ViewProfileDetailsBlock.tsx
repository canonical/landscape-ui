import { lazy, type FC } from "react";
import type { Profile } from "../../../../types";
import {
  isRemovalProfile,
  isScriptProfile,
  isSecurityProfile,
  isUpgradeProfile,
  isWslProfile,
} from "../../../../helpers";
import InfoGrid from "@/components/layout/InfoGrid/InfoGrid";
import Blocks from "@/components/layout/Blocks";

const ViewRemovalProfileDetailsBlock = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.ViewRemovalProfileDetailsBlock,
  })),
);

const ViewScriptProfileDetailsBlock = lazy(async () =>
  import("@/features/script-profiles").then((module) => ({
    default: module.ViewScriptProfileDetailsBlock,
  })),
);

const ViewSecurityProfileDetailsBlock = lazy(async () =>
  import("@/features/security-profiles").then((module) => ({
    default: module.ViewSecurityProfileDetailsBlock,
  })),
);

const ViewUpgradeProfileDetailsBlock = lazy(async () =>
  import("@/features/upgrade-profiles").then((module) => ({
    default: module.ViewUpgradeProfileDetailsBlock,
  })),
);

const ViewWslProfileDetailsBlock = lazy(async () =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.ViewWslProfileDetailsBlock,
  })),
);

interface ViewProfileDetailsBlockProps {
  readonly profile: Profile;
}

const ViewProfileDetailsBlock: FC<ViewProfileDetailsBlockProps> = ({
  profile,
}) => {
  const getProfileDetailsBlock = () => {
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
  };

  const profileDetailsBlock = getProfileDetailsBlock();
  if (profileDetailsBlock) {
    return (
      <Blocks.Item title="Details">
        <InfoGrid dense>{profileDetailsBlock}</InfoGrid>
      </Blocks.Item>
    );
  }
  return;
};

export default ViewProfileDetailsBlock;
