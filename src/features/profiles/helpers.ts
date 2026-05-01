import type { RepositoryProfile } from "../repository-profiles";
import type { ScriptProfile } from "../script-profiles";
import type { RebootProfile } from "../reboot-profiles";
import type { WslProfile } from "../wsl-profiles";
import type { PackageProfile } from "../package-profiles";
import type { UpgradeProfile } from "../upgrade-profiles";
import type { USGProfile } from "../usg-profiles";
import type { RemovalProfile } from "../removal-profiles";
import type { Profile } from "./types";
import { toCronPhrase } from "@/components/form/CronSchedule/components/CronSchedule/helpers";

export enum ProfileTypes {
  package = "package",
  reboot = "reboot",
  removal = "removal",
  repository = "repository",
  script = "script",
  upgrade = "upgrade",
  usg = "USG",
  wsl = "WSL",
}

export const getTriggerText = (profile: ScriptProfile, long = false) => {
  switch (profile.trigger.trigger_type) {
    case "event":
      return "Post enrollment";
    case "one_time":
      return "On a date";
    case "recurring": {
      if (long) {
        return `Recurring, ${toCronPhrase(profile.trigger.interval)}`;
      }
      return "Recurring";
    }
  }
};

export function isScriptProfile(profile: Profile): profile is ScriptProfile {
  return "script_id" in profile;
}

export function isUsgProfile(profile: Profile): profile is USGProfile {
  return "benchmark" in profile;
}

export function isRebootProfile(profile: Profile): profile is RebootProfile {
  return ["num_computers", "schedule", "next_run"].every(
    (key) => key in profile,
  );
}

export function isUpgradeProfile(profile: Profile): profile is UpgradeProfile {
  return "upgrade_type" in profile;
}

export function isPackageProfile(profile: Profile): profile is PackageProfile {
  return "constraints" in profile;
}

export function isRemovalProfile(profile: Profile): profile is RemovalProfile {
  return "days_without_exchange" in profile;
}

export function isRepositoryProfile(
  profile: Profile,
): profile is RepositoryProfile {
  return "apt_sources" in profile;
}

export function isWslProfile(profile: Profile): profile is WslProfile {
  return "image_name" in profile;
}

export const canDuplicateProfile = (
  profile: Profile,
): profile is RebootProfile | PackageProfile | USGProfile =>
  isRebootProfile(profile) ||
  isPackageProfile(profile) ||
  isUsgProfile(profile);

export const hasComplianceData = (
  profile: Profile,
): profile is WslProfile | PackageProfile =>
  isWslProfile(profile) || isPackageProfile(profile);

export const usesNameAsIdentifier = (
  profile: Profile,
): profile is WslProfile | PackageProfile | RepositoryProfile =>
  isWslProfile(profile) ||
  isPackageProfile(profile) ||
  isRepositoryProfile(profile);

export const hasLastRunData = (
  profile: Profile,
): profile is ScriptProfile | USGProfile =>
  isScriptProfile(profile) || isUsgProfile(profile);

export const hasAssociations = (profile: Profile) =>
  !!profile.tags.length || profile.all_computers;

export const isProfileArchived = (profile: Profile) =>
  profile.status === "archived" || !!profile.archived;

export const isPostEnrollmentScriptProfile = (profile: Profile) =>
  isScriptProfile(profile) && profile.trigger.trigger_type === "event";

export const hasSchedule = (type: ProfileTypes) =>
  [
    ProfileTypes.script,
    ProfileTypes.reboot,
    ProfileTypes.upgrade,
    ProfileTypes.usg,
  ].includes(type);

export const hasDescription = (type: ProfileTypes) =>
  [ProfileTypes.repository, ProfileTypes.wsl, ProfileTypes.package].includes(
    type,
  );

export const canArchiveProfile = (type: ProfileTypes) =>
  [ProfileTypes.usg, ProfileTypes.script].includes(type);

export const hasApiSearch = (type: ProfileTypes) =>
  [ProfileTypes.script, ProfileTypes.usg, ProfileTypes.wsl].includes(type);

export const hasComplianceColumns = (type: ProfileTypes) =>
  [ProfileTypes.wsl, ProfileTypes.package].includes(type);
