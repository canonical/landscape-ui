import { useArchiveScriptProfile } from "@/features/script-profiles";
import { useArchiveSecurityProfile } from "@/features/security-profiles";
import { useRemoveRebootProfile } from "@/features/reboot-profiles";
import { useRemoveWslProfile } from "@/features/wsl-profiles";
import { usePackageProfiles } from "@/features/package-profiles";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import { useRemovalProfiles } from "@/features/removal-profiles";
import { useUpgradeProfiles } from "@/features/upgrade-profiles";
import { ProfileTypes } from "../helpers";

interface RemoveWithProfileIdParams {
  id: number;
}

interface RemoveWithProfileNameParams {
  name: string;
}

export type RemoveProfileParams = RemoveWithProfileNameParams &
  RemoveWithProfileIdParams;

export const useRemoveProfile = (type: ProfileTypes) => {
  const { archiveScriptProfile, isArchivingScriptProfile } =
    useArchiveScriptProfile();
  const { archiveSecurityProfile, isArchivingSecurityProfile } =
    useArchiveSecurityProfile();
  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfile();
  const { removeWslProfile, isRemovingWslProfile } = useRemoveWslProfile();

  const { removePackageProfileQuery } = usePackageProfiles();
  const { removeRepositoryProfileQuery } = useRepositoryProfiles();
  const { removeRemovalProfileQuery } = useRemovalProfiles();
  const { removeUpgradeProfileQuery } = useUpgradeProfiles();

  const removeProfile = async (params: RemoveProfileParams) => {
    switch (type) {
      case ProfileTypes.package:
        return removePackageProfileQuery.mutateAsync({ name: params.name });
      case ProfileTypes.repository:
        return removeRepositoryProfileQuery.mutateAsync({ name: params.name });
      case ProfileTypes.reboot:
        return removeRebootProfile({ id: params.id });
      case ProfileTypes.removal:
        return removeRemovalProfileQuery.mutateAsync({ name: params.name });
      case ProfileTypes.script:
        return archiveScriptProfile({ id: params.id });
      case ProfileTypes.security:
        return archiveSecurityProfile({ id: params.id });
      case ProfileTypes.upgrade:
        return removeUpgradeProfileQuery.mutateAsync({ name: params.name });
      case ProfileTypes.wsl:
        return removeWslProfile({ name: params.name });
      default:
        throw new Error(`Unsupported profile type: ${type}`);
    }
  };

  const getIsRemovingProfile = () => {
    switch (type) {
      case ProfileTypes.package:
        return removePackageProfileQuery.isPending;
      case ProfileTypes.repository:
        return removeRepositoryProfileQuery.isPending;
      case ProfileTypes.reboot:
        return isRemovingRebootProfile;
      case ProfileTypes.removal:
        return removeRemovalProfileQuery.isPending;
      case ProfileTypes.script:
        return isArchivingScriptProfile;
      case ProfileTypes.security:
        return isArchivingSecurityProfile;
      case ProfileTypes.upgrade:
        return removeUpgradeProfileQuery.isPending;
      case ProfileTypes.wsl:
        return isRemovingWslProfile;
      default:
        return false;
    }
  };

  return {
    removeProfile,
    isRemovingProfile: getIsRemovingProfile(),
  };
};
