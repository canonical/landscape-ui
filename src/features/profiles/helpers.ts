import type { 
  PackageProfile, 
  Profile,
  RebootProfile,
  RemovalProfile,
  RepositoryProfile,
  ScriptProfile,
  SecurityProfile,
  UpgradeProfile,
  WslProfile,
} from "./types";

  
export function isScriptProfile(profile: Profile): profile is ScriptProfile {
  return 'script_id' in profile;
}

export function isSecurityProfile(profile: Profile): profile is SecurityProfile {
  return 'benchmark' in profile;
}

export function isRebootProfile(profile: Profile): profile is RebootProfile {
  return ['num_computers', 'schedule', 'next_run'].every(key => key in profile);
}

export function isUpgradeProfile(profile: Profile): profile is UpgradeProfile {
  return 'upgrade_type' in profile;
}

export function isPackageProfile(profile: Profile): profile is PackageProfile {
  return 'constraints' in profile;
}

export function isRemovalProfile(profile: Profile): profile is RemovalProfile {
  return 'days_without_exchange' in profile;
}

export function isRepositoryProfile(profile: Profile): profile is RepositoryProfile {
  return 'pockets' in profile;
}

export function isWslProfile(profile: Profile): profile is WslProfile {
  return 'image_name' in profile;
}


export const canDuplicateProfile = (profile: Profile): profile is RebootProfile | PackageProfile | SecurityProfile =>
  isRebootProfile(profile) || isPackageProfile(profile) || isSecurityProfile(profile);  

export const hasComplianceData = (profile: Profile): profile is WslProfile | PackageProfile => 
  isWslProfile(profile) || isPackageProfile(profile);

export const hasLastRunData = (profile: Profile): profile is ScriptProfile | SecurityProfile =>
  isScriptProfile(profile) || isSecurityProfile(profile);

export const hasSchedule = (profile: Profile): profile is RebootProfile | ScriptProfile | UpgradeProfile | SecurityProfile => 
  isScriptProfile(profile) || isRebootProfile(profile) || isUpgradeProfile(profile) || isSecurityProfile(profile);

export const canArchiveProfile = (profile: Profile): profile is SecurityProfile | ScriptProfile =>
  isSecurityProfile(profile) || isScriptProfile(profile);

export const hasDescription = (profile: Profile): profile is RepositoryProfile | WslProfile | PackageProfile => 
  isRepositoryProfile(profile) || isWslProfile(profile) || isPackageProfile(profile);

export const isProfileArchived = (profile: Profile) =>
  profile.status == 'archived' || profile.archived;
