type Environment = "saas" | "selfHosted";

export interface MenuItem {
  label: string;
  path: string;
  env?: Environment;
  icon?: string;
  items?: MenuItem[];
  requiresFeature?: FeatureKey;
}
