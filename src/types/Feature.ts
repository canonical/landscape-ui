import type { ServerFeatureKey, DebarchiveFeatureKey } from "./FeatureKey";

export interface Feature {
  database_key: number;
  description: string;
  details: {
    account?: boolean;
    configuration: boolean;
  };
  enabled: boolean;
  key: ServerFeatureKey;
  name: string;
}

export interface DebarchiveFeature {
  name: string;
  featureId: DebarchiveFeatureKey;
  displayName: string;
  description: string;
  enabled: boolean;
}
