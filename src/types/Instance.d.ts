import type { AccessGroup } from "@/features/access-groups";

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
  readonly cpu: readonly Cpu[];
  readonly display: Display;
  readonly memory: Memory;
  readonly multimedia: Multimedia;
  readonly network: readonly GroupedHardwareNetwork[] | string;
  readonly pci: readonly Pci[];
  readonly scsi: readonly Scsi[];
  readonly storage: readonly Storage[] | string;
  readonly system: System;
  readonly usb: readonly Usb[];
}

interface Storage {
  readonly description: string;
  readonly partitions: readonly Partition[];
  readonly product: string;
  readonly size: string;
  readonly vendor: string;
}

interface Partition {
  readonly description: string;
  readonly filesystem: string;
  readonly size: string;
}

interface GroupedHardwareNetwork {
  readonly description: string;
  readonly ip: string;
  readonly mac: string;
  readonly product: string;
  readonly vendor: string;
}
interface Cpu {
  readonly architecture: string;
  readonly cache: Cache;
  readonly clock_speed: string;
  readonly flags: readonly Flag[];
  readonly model: string;
  readonly vendor: string;
}

interface Cache {
  readonly "L1 cache"?: string;
  readonly "L2 cache"?: string;
  readonly "L3 cache"?: string;
  readonly "L4 cache"?: string;
}

interface Flag {
  readonly code: string;
  readonly title: string;
}

interface Display {
  readonly model: string;
  readonly vendor: string;
}

interface Memory {
  readonly size: string;
}

interface Multimedia {
  readonly model: string;
  readonly vendor: string;
}

interface Pci {
  readonly attached_devices: readonly AttachedDevice[];
  readonly description: string;
  readonly model: string;
  readonly vendor: string;
}

interface AttachedDevice {
  readonly description: string;
  readonly model: string;
  readonly vendor: string;
}

interface Scsi {
  readonly description: string;
  readonly model: string;
  readonly vendor: string;
}

interface System {
  readonly bios_capabilities: readonly BiosCapability[];
  readonly bios_date: string;
  readonly bios_vendor: string;
  readonly bios_version: string;
  readonly chassis: string;
  readonly model: string;
  readonly serial: string;
  readonly vendor: string;
}

interface BiosCapability {
  readonly code: string;
  readonly title: string;
}

interface Usb {
  readonly description: string;
  readonly model: string;
  readonly vendor: string;
}

type HardwareDescription = [
  attribute: string,
  title: string,
  value: number | null,
];

interface InstanceAlert {
  readonly type: string;
  readonly summary: string;
  readonly severity: "warning" | "danger" | "info";
}

interface InstanceUpgrades {
  readonly regular: number;
  readonly security: number;
}

interface UbuntuProAccount {
  readonly created_at: string;
  readonly external_account_ids: readonly {
    readonly IDs: readonly string[];
    readonly origin: string;
  }[];
  readonly id: string;
  readonly name: string;
}

interface UbuntuProContract {
  readonly created_at: string;
  readonly id: string;
  readonly name: string;
  readonly products: readonly string[];
  readonly tech_support_level: string;
}

export interface UbuntuProService extends Readonly<Record<string, unknown>> {
  readonly name: string;
  readonly available: string;
  readonly description: string;
  readonly entitled?: string;
  readonly status?: string;
  readonly status_details?: string;
}

interface UbuntuProInfo {
  readonly attached: boolean;
  readonly expires: string | null;
  readonly services: readonly UbuntuProService[];
  readonly techSupportLevel?: string;
  readonly effective?: string;
  readonly contract?: UbuntuProContract;
  readonly account?: UbuntuProAccount;
}

interface DistributionInfo {
  readonly code_name: string;
  readonly description: string;
  readonly distributor: string;
  readonly release: string;
}

export interface InstanceWithoutRelation
  extends Readonly<Record<string, unknown>> {
  readonly access_group: AccessGroup["name"];
  readonly cloud_init: {
    readonly availability_zone?: string | null;
  };
  readonly comment: string;
  readonly distribution: string | null;
  readonly distribution_info: DistributionInfo | null;
  readonly hostname: string;
  readonly id: number;
  readonly is_default_child: boolean | null;
  readonly is_wsl_instance: boolean;
  readonly last_ping_time: string | null;
  readonly tags: readonly string[];
  readonly title: string;
  readonly ubuntu_pro_info: UbuntuProInfo | null;
  readonly annotations?: Readonly<Record<string, string>>;
  readonly grouped_hardware?: GroupedHardware;
  readonly alerts?: readonly InstanceAlert[];
  readonly upgrades?: InstanceUpgrades;
}

interface WithRelation<Type extends InstanceWithoutRelation> extends Type {
  readonly children: readonly InstanceWithoutRelation[];
  readonly parent: InstanceWithoutRelation | null;
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
