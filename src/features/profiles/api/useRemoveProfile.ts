import type { ProfileType } from "../types";
import { useArchiveScriptProfile } from "@/features/script-profiles";
import { useArchiveSecurityProfile } from "@/features/security-profiles";
import { useRemoveRebootProfile } from "@/features/reboot-profiles";
import { useRemoveWslProfile } from "@/features/wsl-profiles";
import { usePackageProfiles } from "@/features/package-profiles";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import { useRemovalProfiles } from "@/features/removal-profiles";
import { useUpgradeProfiles } from "@/features/upgrade-profiles";

interface RemoveWithProfileIdParams {
  id: number;
}

interface RemoveWithProfileNameParams {
  name: string;
}

export type RemoveProfileParams = RemoveWithProfileNameParams & RemoveWithProfileIdParams;

export const useRemoveProfile = (type: ProfileType) => {
  const { archiveScriptProfile, isArchivingScriptProfile } = useArchiveScriptProfile();
  const { archiveSecurityProfile, isArchivingSecurityProfile } = useArchiveSecurityProfile();
  const { removeRebootProfile, isRemovingRebootProfile } = useRemoveRebootProfile();
  const { removeWslProfile, isRemovingWslProfile } = useRemoveWslProfile();

  const { removePackageProfileQuery } = usePackageProfiles();
  const { removeRepositoryProfileQuery } = useRepositoryProfiles();
  const { removeRemovalProfileQuery } = useRemovalProfiles();
  const { removeUpgradeProfileQuery } = useUpgradeProfiles();

  const removeProfile = async (params: RemoveProfileParams) => {
    switch (type) {
      case "package":
        return removePackageProfileQuery.mutateAsync({ name: params.name });
      case "repository":
        return removeRepositoryProfileQuery.mutateAsync({ name: params.name });
      case "reboot":
        return removeRebootProfile({ id: params.id });
      case "removal":
        return removeRemovalProfileQuery.mutateAsync({ name: params.name });
      case "script":
        return archiveScriptProfile({ id: params.id });
      case "security":
        return archiveSecurityProfile({ id: params.id });
      case "upgrade":
        return removeUpgradeProfileQuery.mutateAsync({ name: params.name });
      case "wsl":
        return removeWslProfile({ name: params.name });
      default:
        throw new Error(`Unsupported profile type: ${type}`);
    }
  };

  const isRemovingProfile = (() => {
    switch (type) {
      case "package":
        return removePackageProfileQuery.isPending;
      case "repository":
        return removeRepositoryProfileQuery.isPending;
      case "reboot":
        return isRemovingRebootProfile;
      case "removal":
        return removeRemovalProfileQuery.isPending;
      case "script":
        return isArchivingScriptProfile;
      case "security":
        return isArchivingSecurityProfile;
      case "upgrade":
        return removeUpgradeProfileQuery.isPending;
      case "wsl":
        return isRemovingWslProfile;
    }
  })();

  return {
    removeProfile,
    isRemovingProfile,
  };
};
