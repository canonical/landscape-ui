import {
  SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT,
  type SecurityProfile,
} from "@/features/security-profiles";
import type { Instance } from "@/types/Instance";

export const instancesToAssignCount = (
  profile: SecurityProfile,
  instances: Instance[],
) =>
  instances.filter((instance) =>
    profile.tags.every((tag) => !instance.tags.includes(tag)),
  ).length;

export const finalAssociatedInstanceCount = (
  profile: SecurityProfile,
  instances: Instance[],
) => profile.associated_instances + instancesToAssignCount(profile, instances);

export const willBeOverLimit = (
  profile: SecurityProfile,
  instances: Instance[],
) =>
  finalAssociatedInstanceCount(profile, instances) >=
  SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT;
