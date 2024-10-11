export interface LivepatchInformation {
  livepatch_info: LivepatchInfo | null;
  ubuntu_pro_livepatch_service_info: UbuntuProLivepatchServiceInfo | null;
  ubuntu_pro_reboot_required_info: UbuntuProRebootRequiredInfo | null;
}

interface LivepatchInfo {
  json: LivepatchContainer;
}

interface LivepatchContainer {
  error: string;
  output: InstanceInformation;
  return_code: number;
}

interface InstanceInformation {
  Status: Status[];
  tier: string;
}

interface Status {
  Kernel: string;
  Livepatch: Livepatch;
  Running: boolean;
  Supported: string;
  UpgradeRequiredDate: string;
}

interface Livepatch {
  CheckState: string;
  Fixes: Fix[];
  State: string;
  Version: string;
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
