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

export interface GroupedHardware {
  cpu: Cpu[];
  display: Display;
  memory: Memory;
  multimedia: Multimedia;
  network: GroupedHardwareNetwork[] | string;
  pci: Pci[];
  scsi: Scsi[];
  storage: Storage[] | string;
  system: System;
  usb: Usb[];
}

interface Storage {
  description: string;
  partitions: Partition[];
  product: string;
  size: string;
  vendor: string;
}

interface Partition {
  description: string;
  filesystem: string;
  size: string;
}

interface GroupedHardwareNetwork {
  description: string;
  ip: string;
  mac: string;
  product: string;
  vendor: string;
}
interface Cpu {
  architecture: string;
  cache: Cache;
  clock_speed: string;
  flags: Flag[];
  model: string;
  vendor: string;
}

interface Cache {
  "L1 cache"?: string;
  "L2 cache"?: string;
  "L3 cache"?: string;
  "L4 cache"?: string;
}

interface Flag {
  code: string;
  title: string;
}

interface Display {
  model: string;
  vendor: string;
}

interface Memory {
  size: string;
}

interface Multimedia {
  model: string;
  vendor: string;
}

interface Pci {
  attached_devices: AttachedDevice[];
  description: string;
  model: string;
  vendor: string;
}

interface AttachedDevice {
  vendor: string;
  model: string;
  description: string;
}

interface Scsi {
  description: string;
  model: string;
  vendor: string;
}

interface System {
  bios_capabilities: BiosCapability[];
  bios_date: string;
  bios_vendor: string;
  bios_version: string;
  chassis: string;
  model: string;
  serial: string;
  vendor: string;
}

interface BiosCapability {
  code: string;
  title: string;
}

interface Usb {
  description: string;
  model: string;
  vendor: string;
}

interface VmInfo {}

type HardwareDescription = [
  attribute: string,
  title: string,
  value: number | null,
];

interface UbuntuProAccount {
  created_at: string;
  external_account_ids: { IDs: string[]; origin: string }[];
  id: string;
  name: string;
}

interface UbuntuProConfig {
  contract_url: string;
  data_dir: string;
  log_file: string;
  log_level: string;
  security_url: string;
  ua_config: {
    apt_news: boolean;
    apt_news_url: string;
    global_apt_http_proxy: string | null;
    global_apt_https_proxy: string | null;
    http_proxy: string | null;
    https_proxy: string | null;
    metering_timer: number;
    ua_apt_http_proxy: string | null;
    ua_apt_https_proxy: string | null;
    update_messaging_timer: number;
  };
}

interface UbuntuProContract {
  created_at: string;
  id: string;
  name: string;
  products: string[];
  tech_support_level: string;
}

interface UbuntuProService {
  available: string;
  blocked_by: [];
  description: string;
  description_override: null;
  entitled: string;
  name: string;
  status: string;
  status_details: string;
  warning: null;
}

interface UbuntuProInfo {
  account: UbuntuProAccount;
  attached: boolean;
  config: UbuntuProConfig;
  config_path: string;
  contract: UbuntuProContract;
  effective: string;
  environment_vars: [];
  errors: [];
  execution_details: string;
  execution_status: string;
  expires: string;
  features: {};
  machine_id: string;
  notices: [];
  result: string;
  services: UbuntuProService[];
  simulated: boolean;
  version: string;
  warnings: [];
  _doc: string;
  _schema_version: string;
}

export interface ComputerWithoutRelation extends Record<string, unknown> {
  access_group: AccessGroup["name"];
  annotations?: Record<string, string>;
  clone_id: number | null;
  cloud_instance_metadata: CloudInstanceMetadata;
  comment: string;
  container_info: string | null;
  distribution: string;
  grouped_hardware?: GroupedHardware;
  hardware?: HardwareDescription[];
  hostname: string;
  id: number;
  is_wsl_instance: boolean;
  last_exchange_time: string | null;
  last_ping_time: string | null;
  network_devices?: NetworkDevice[];
  reboot_required_flag: boolean;
  secrets_name: string | null;
  tags: string[];
  title: string;
  total_memory: number | null;
  total_swap: number | null;
  ubuntu_pro_info: UbuntuProInfo | null;
  update_manager_prompt: string;
  vm_info: VmInfo | null;
}

export interface Computer extends ComputerWithoutRelation {
  children: ComputerWithoutRelation[];
  parent: ComputerWithoutRelation | null;
}
