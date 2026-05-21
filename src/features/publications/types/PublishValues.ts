export interface PublishNewFormValues {
  name: string;
  publicationTarget: string;
  signingKey: string;
  hashIndexing: boolean;
  automaticUpgrades: boolean;
  limitAutomaticInstallation: boolean;
  skipBz2: boolean;
  skipContentIndexing: boolean;
}
