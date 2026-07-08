import type { AUTOMATIC_LABELS } from "../constants";

export interface PublishSettingsValues {
  hashIndexing: boolean;
  installsAndUpgrades: keyof typeof AUTOMATIC_LABELS;
  skipBz2: boolean;
  skipContentIndexing: boolean;
}

export interface PublishNewFormValues extends PublishSettingsValues {
  name: string;
  publicationTarget: string;
  distribution?: string;
  architectures?: string[];
  signingKey: string;
}
