export interface PublishSettingsValues {
  hashIndexing: boolean;
  limitAutomaticInstallation: boolean;
  automaticUpgrades: boolean;
  skipBz2: boolean;
  skipContentIndexing: boolean;
}

export interface PublishNewFormValues extends PublishSettingsValues {
  name: string;
  publicationTarget: string;
  signingKey: string;
}
