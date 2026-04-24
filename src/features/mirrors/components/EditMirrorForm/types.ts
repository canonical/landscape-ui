export interface FormProps {
  name: string;
  downloadUdebPackages: boolean;
  downloadSources: boolean;
  downloadInstallerFiles: boolean;
  verificationGpgKey?: string;
}
