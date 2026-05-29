import type { AUTOMATIC_KEY } from "../constants";

export interface PublishSettingsValues {
  hashIndexing: boolean;
  installsAndUpgrades: AUTOMATIC_KEY;
  skipBz2: boolean;
  skipContentIndexing: boolean;
}

export interface PublishNewFormValues extends PublishSettingsValues {
  name: string;
  publicationTarget: string;
  signingKey: string;
}
