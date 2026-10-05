import type { Feature } from "@/types/Feature";

/**
 * What the feature registry says about a feature, without `enabled` and
 * `details`: those describe the caller's own account, not the one being viewed.
 */
export type FeatureRegistryEntry = Pick<
  Feature,
  "database_key" | "key" | "name" | "description"
>;
