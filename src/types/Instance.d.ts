import type { AccessGroup } from "@/features/access-groups";
import type { Profile } from "./Profile";

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

interface Cpu {
  architecture: string;
  cache: Cache;
  clock_speed: string;
  flags: Flag[];
  model: string;
  vendor: string;
}

interface Display {
  model: string;
  vendor: string;
}

interface Storage {
  description: string;
  partitions: Partition[];
  product: string;
  size: string;
  vendor: string;
}

interface Memory {
  size: string;
}

interface Multimedia {
  model: string;
  vendor: string;
}

interface AttachedDevice {
  description: string;
  model: string;
  vendor: string;
}

interface Pci {
  attached_devices: AttachedDevice[];
  description: string;
  model: string;
  vendor: string;
}

interface Scsi {
  description: string;
  model: string;
  vendor: string;
}

interface BiosCapability {
  code: string;
  title: string;
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

interface Usb {
  description: string;
  model: string;
  vendor: string;
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

type HardwareDescription = [
  attribute: string,
  title: string,
  value: number | null,
];

interface InstanceAlert {
  type: string;
  summary: string;
  severity: "warning" | "danger" | "info";
}

interface InstanceUpgrades {
  regular: number;
  security: number;
}

interface UbuntuProAccount {
  created_at: string;
  external_account_ids: { IDs: string[]; origin: string }[];
  id: string;
  name: string;
}

interface UbuntuProContract {
  created_at: string;
  id: string;
  name: string;
  products: string[];
  tech_support_level: string;
}

export interface UbuntuProService extends Record<string, unknown> {
  name: string;
  available: string;
  description: string;
  entitled?: string;
  status?: string;
  status_details?: string;
}

interface UbuntuProInfo {
  attached: boolean;
  expires: string | null;
  services: UbuntuProService[];
  techSupportLevel?: string;
  effective?: string;
  contract?: UbuntuProContract;
  account?: UbuntuProAccount;
  result: "success";
}

interface FailedUbuntuProInfo {
  errors: {
    message: string;
    message_code: string;
    service: string | null;
    type: string;
  }[];
  result: "failure";
}

interface DistributionInfo {
  code_name: string | null;
  description: string;
  distributor: string;
  release: string;
}

export interface InstanceWithoutRelation extends Record<string, unknown> {
  access_group: AccessGroup["name"];
  archived: boolean;
  cloud_init: {
    availability_zone?: string | null;
  };
  comment: string;
  distribution: string | null;
  distribution_info: DistributionInfo | null;
  employee_id: number | null;
  hostname: string | null;
  id: number;
  is_default_child: boolean | null;
  is_wsl_instance: boolean;
  last_ping_time: string | null;
  registered_at: string;
  tags: string[];
  title: string;
  ubuntu_pro_info: UbuntuProInfo | FailedUbuntuProInfo | null;
  alerts?: InstanceAlert[];
  annotations?: Record<string, string>;
  grouped_hardware?: GroupedHardware;
  profiles?: Profile[];
  upgrades?: InstanceUpgrades;
  wsl_profiles?: Profile[];
}

interface WithRelation<Type extends InstanceWithoutRelation> extends Type {
  parent: InstanceWithoutRelation | null;
}

export type Instance = WithRelation<InstanceWithoutRelation>;

export interface FreshInstance extends Instance {
  distribution: null;
  distribution_info: null;
}

interface WithDistribution<Type extends InstanceWithoutRelation> extends Type {
  distribution: string;
  distribution_info: DistributionInfo;
}

export type UbuntuInstanceWithoutRelation =
  WithDistribution<InstanceWithoutRelation>;

export type UbuntuInstance = WithRelation<UbuntuInstanceWithoutRelation>;

export interface WslInstanceWithoutRelation
  extends UbuntuInstanceWithoutRelation {
  is_default_child: boolean;
  is_wsl_instance: true;
}

export interface WindowsInstanceWithoutRelation
  extends WithDistribution<InstanceWithoutRelation> {
  is_default_child: null;
  is_wsl_instance: false;
}

export interface WslInstance
  extends WithRelation<WslInstanceWithoutRelation>,
    UbuntuInstance {
  parent: WindowsInstanceWithoutRelation;
}

export interface WindowsInstance
  extends WithRelation<WindowsInstanceWithoutRelation> {
  parent: null;
}

export interface PendingInstance extends Record<string, unknown> {
  access_group: string | null;
  client_tags: string[];
  container_info: string | null;
  creation_time: string;
  hostname: string;
  id: number;
  title: string;
  vm_info: string | null;
}

export interface InstanceChild extends Record<string, unknown> {
  name: string;
  version_id: string;
  compliance:
    | "compliant"
    | "pending"
    | "noncompliant"
    | "uninstalled"
    | "unregistered";
  computer_id: number | null;
  profile: string | null;
  is_running: boolean;
  installed: boolean;
  registered: boolean;
  default: boolean | null;
}
