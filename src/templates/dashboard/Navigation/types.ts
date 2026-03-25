import type { FeatureKey } from "@/types/FeatureKey";

type Environment = "saas" | "selfHosted";

export interface MenuItem {
  label: string;
  path: string;
  env?: Environment;
  icon?: string;
  items?: MenuItem[];
  requiresFeature?: FeatureKey;
  hasDivider?: boolean;
  badge?: {
    count: number;
    isNegative: boolean;
  };
}
