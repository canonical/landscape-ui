import { useGetSecurityProfiles } from "@/features/security-profiles";
import type { Instance } from "@/types/Instance";
import { instancesToAssignCount } from "../helpers";

export function useTaggedSecurityProfiles(
  tags: string[],
  instances: Instance[],
) {
  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({ statuses: ["active"] });

  return {
    securityProfiles: securityProfiles.filter(
      (profile) =>
        profile.tags.some((tag) => tags.includes(tag)) &&
        instancesToAssignCount(profile, instances),
    ),
    isSecurityProfilesLoading,
  };
}
