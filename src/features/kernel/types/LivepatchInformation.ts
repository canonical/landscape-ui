export interface LivepatchInformation {
  livepatch_info: LivepatchInfo | null;
  ubuntu_pro_livepatch_service_info: UbuntuProLivepatchServiceInfo | null;
  ubuntu_pro_reboot_required_info: UbuntuProRebootRequiredInfo | null;
}

interface LivepatchInfo {
  json?: LivepatchContainer;
}

interface LivepatchContainer {
  error: string;
  return_code: number;
  output?: InstanceInformation;
}

interface InstanceInformation {
  Status: KernelStatus[];
  tier: string;
}

export interface KernelStatus {
  Kernel: string;
  Livepatch: Livepatch;
  Running: boolean;
  Supported: string;
  UpgradeRequiredDate: string | null;
}

interface Livepatch {
  CheckState: string;
  State: string;
  Version: string;
  Fixes?: Fix[];
}

export interface Fix extends Record<string, unknown> {
  Bug: string;
  Description: string;
  Name: string;
  Patched: boolean;
}

interface UbuntuProLivepatchServiceInfo {
  available: string;
  entitled: string;
  name: string;
  status: string;
  status_details: string;
}

interface UbuntuProRebootRequiredInfo {
  output: LivepatchEnabled;
}

interface LivepatchEnabled {
  livepatch_enabled: boolean;
}
