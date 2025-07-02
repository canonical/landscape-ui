import type { FeatureKey } from "./FeatureKey";

export interface Feature {
  database_key: number;
  description: string;
  details: {
    account?: boolean;
    configuration: boolean;
  };
  enabled: boolean;
  key: FeatureKey;
  name: string;
}
