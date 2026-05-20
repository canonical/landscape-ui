export interface FormProps {
  name: string;
  sourceType: string;
  source: string;
  publicationTarget: string;
  prefix: string;
  uploaderDistribution: string;
  uploaderArchitectures: string[];
  signingKey: string;
  hashIndexing: boolean;
  limitAutomaticInstallation: boolean;
  automaticUpgrades: boolean;
  skipBz2: boolean;
  skipContentIndexing: boolean;
}

export interface SelectableSource {
  label: string;
  value: string;
  sourceType: string;
  distribution?: string;
  components: string[];
  architectures: string[];
  preserveSignatures?: boolean;
}
