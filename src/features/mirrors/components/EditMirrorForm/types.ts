export interface FormProps {
  name: string;
  preserveSignatures: boolean;
  downloadUdebPackages: boolean;
  downloadSources: boolean;
  downloadInstallerFiles: boolean;
  verificationGpgKey?: string;
  packageFilter?: string;
  includeDependencies?: boolean;
  keepCurrentGpgKey: boolean;
}
