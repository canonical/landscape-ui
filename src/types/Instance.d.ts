import { AccessGroup } from "@/features/access-groups";

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
  description: string;
  model: string;
  vendor: string;
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
}

interface DistributionInfo {
  code_name: string;
  description: string;
  distributor: string;
  release: string;
}

export interface InstanceWithoutRelation extends Record<string, unknown> {
  access_group: AccessGroup["name"];
  cloud_init: {
    availability_zone?: string | null;
  };
  comment: string;
  distribution: string | null;
  distribution_info: DistributionInfo | null;
  hostname: string;
  id: number;
  is_default_child: boolean | null;
  is_wsl_instance: boolean;
  last_ping_time: string | null;
  tags: string[];
  title: string;
  ubuntu_pro_info: UbuntuProInfo | null;
  annotations?: Record<string, string>;
  grouped_hardware?: GroupedHardware;
  alerts?: InstanceAlert[];
  upgrades?: InstanceUpgrades;
}

interface WithRelation<Type extends InstanceWithoutRelation> extends Type {
  children: InstanceWithoutRelation[];
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

export type UbuntuInstanceWithoutRelation = WithDistribution<Instance>;

export interface UbuntuInstance
  extends WithRelation<UbuntuInstanceWithoutRelation> {
  children: [];
}

export interface WslInstanceWithoutRelation
  extends UbuntuInstanceWithoutRelation {
  is_default_child: boolean;
  is_wsl_instance: true;
}

export interface WslInstance
  extends WithRelation<WslInstanceWithoutRelation>,
    UbuntuInstance {
  parent: WindowsInstanceWithoutRelation;
}

export interface WindowsInstanceWithoutRelation
  extends WithDistribution<InstanceWithoutRelation> {
  is_default_child: null;
  is_wsl_instance: false;
}

export interface WindowsInstance
  extends WithRelation<WindowsInstanceWithoutRelation> {
  children: WslInstanceWithoutRelation[];
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
