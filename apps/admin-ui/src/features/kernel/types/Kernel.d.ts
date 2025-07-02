export interface KernelOverviewInfo {
  currentVersion: string;
  expirationDate: string;
  status: string;
}

export interface KernelManagementInfo {
  downgrades: Kernel[];
  installed: Kernel | null;
  message: string;
  smart_status: string;
  upgrades: Kernel[];
}

export interface Kernel {
  id: number;
  name: string;
  version_rounded: string;
  version: string;
}
