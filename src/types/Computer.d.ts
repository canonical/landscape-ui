import { AccessGroup } from "./accessGroup";

interface CloudInstanceMetadata {
  "ami-id"?: string;
  "instance-id"?: string;
  "instance-type"?: string;
}

interface NetworkDevice {
  broadcast_address: string;
  duplex: boolean;
  interface: string;
  ip_address: string;
  mac_address: string;
  netmask: string;
  speed: number | null;
}

interface VmInfo {}

type HardwareDescription = [
  attribute: string,
  title: string,
  value: number | null
];

export interface Computer extends Record<string, unknown> {
  access_group: AccessGroup["name"];
  annotations?: Record<string, string>;
  clone_id: number | null;
  cloud_instance_metadata: CloudInstanceMetadata;
  comment: string;
  container_info: string | null;
  distribution: string;
  hardware?: HardwareDescription[];
  hostname: string;
  id: number;
  last_exchange_time: string | null;
  last_ping_time: string;
  network_devices?: NetworkDevice[];
  reboot_required_flag: boolean;
  tags: string[];
  title: string;
  total_memory: number | null;
  total_swap: number | null;
  update_manager_prompt: string;
  vm_info: VmInfo | null;
}
