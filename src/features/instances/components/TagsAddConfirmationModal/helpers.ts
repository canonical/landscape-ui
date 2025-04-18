import type { SecurityProfile } from "@/features/security-profiles";
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "@/features/security-profiles";
import type { Instance } from "@/types/Instance";
import { instancesToAssignCount } from "../../helpers";

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
