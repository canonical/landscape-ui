export interface BaseFormProps {
  name: string;
  sourceType: string;
  sourceUrl: string;
  distribution: string;
  components: string[];
  architectures: string[];
  preserveSignatures: boolean;
  downloadUdebPackages: boolean;
  downloadSources: boolean;
  downloadInstallerFiles: boolean;
  token?: string;
  snapshotDate?: string;
  proService?: string;
  verificationGpgKey?: string;
}

export interface UbuntuArchiveFormProps extends BaseFormProps {
  sourceType: "ubuntu-archive";
}

export interface UbuntuSnapshotsFormProps extends BaseFormProps {
  sourceType: "ubuntu-snapshots";
  snapshotDate: string;
}

export interface UbuntuProFormProps extends BaseFormProps {
  sourceType: "ubuntu-pro";
  token: string;
  proService: string;
}

export interface ThirdPartyFormProps extends BaseFormProps {
  sourceType: "third-party";
  verificationGpgKey: string;
}

export type FormProps =
  | UbuntuArchiveFormProps
  | UbuntuSnapshotsFormProps
  | UbuntuProFormProps
  | ThirdPartyFormProps;
