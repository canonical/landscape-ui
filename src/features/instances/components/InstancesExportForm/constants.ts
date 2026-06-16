import type { ExportFieldGroup, InstancesExportFormValues } from "./types";
import { INPUT_DATE_FORMAT } from "@/constants";
import moment from "moment";
import * as Yup from "yup";

export const INITIAL_VALUES: InstancesExportFormValues = {
  name: "",
  selectedFieldIds: [],
  retainUntil: moment().add(3, "years").format(INPUT_DATE_FORMAT),
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().trim().required("This field is required"),
  selectedFieldIds: Yup.array()
    .of(Yup.string().required())
    .min(1, "Select at least one attribute"),
  retainUntil: Yup.string()
    .required("This field is required")
    .test(
      "retain-until-future",
      "Must be a date in the future",
      (value) => !!value && moment(value).isAfter(moment().startOf("day")),
    )
    .test(
      "retain-until-max",
      "Must be within 100 years from today",
      (value) =>
        !!value && moment(value).isSameOrBefore(moment().add(100, "years")),
    ),
});

export const EXPORT_FIELD_GROUPS: readonly ExportFieldGroup[] = [
  {
    title: "Primary Identity",
    key: "primary-identity",
    fields: [
      { id: "hostname", label: "Hostname", defaultSelected: true },
      { id: "title", label: "Instance name", defaultSelected: true },
      { id: "os", label: "OS", defaultSelected: true },
      { id: "id", label: "ID", defaultSelected: true },
      { id: "status", label: "Status", defaultSelected: true },
    ],
  },
  {
    title: "Connectivity",
    key: "connectivity",
    fields: [
      { id: "network_ip_address", label: "IP address" },
      { id: "network_interface", label: "Interface" },
      { id: "network_mac_address", label: "MAC address" },
    ],
  },
  {
    title: "Health & Updates",
    key: "health-updates",
    fields: [
      { id: "reboot_required_flag", label: "Reboot required" },
      { id: "alert_count", label: "Alert count" },
      { id: "upgrades_security", label: "Security upgrades count" },
      { id: "livepatch_info", label: "Livepatch status" },
    ],
  },
  {
    title: "Compute & Storage",
    key: "compute-storage",
    fields: [
      { id: "hardware_cpu_cores", label: "CPU cores" },
      { id: "total_memory", label: "Total memory" },
      { id: "hardware_disk_size", label: "Total disk size" },
      { id: "computer_type", label: "Computer type" },
    ],
  },
  {
    title: "Business Logic",
    key: "business-logic",
    fields: [
      { id: "tags", label: "Tags", defaultSelected: true },
      { id: "access_group", label: "Access group", defaultSelected: true },
      { id: "annotations", label: "Annotations" },
      { id: "ubuntu_pro", label: "Ubuntu Pro expiration" },
      { id: "license_type", label: "License type" },
    ],
  },
  {
    title: "Granular Metadata & Deep Diagnostics",
    key: "granular-metadata-diagnostics",
    fields: [
      { id: "last_ping_time", label: "Last ping", defaultSelected: true },
      { id: "juju_machine_id", label: "Juju machine ID" },
      { id: "cloud_instance_metadata", label: "Cloud instance metadata" },
      { id: "hostagent_uid", label: "Host agent UID" },
      { id: "machine_id", label: "Machine ID" },
      { id: "secure_id", label: "Secure ID" },
      { id: "insecure_id", label: "Insecure ID" },
      { id: "current_api", label: "Client API version" },
      { id: "current_version", label: "Client version" },
      { id: "comment", label: "Comment" },
      { id: "archived", label: "Archived" },
      { id: "account_id", label: "Account ID" },
      { id: "employee_id", label: "Employee ID" },
      { id: "profiles", label: "Associated profiles" },
      { id: "alerts", label: "Active alerts" },
      { id: "reboot_packages", label: "Packages needing reboot" },
      { id: "update_manager_prompt", label: "Update manager prompt" },
      { id: "upgrades_regular", label: "Regular upgrades count" },
      { id: "has_release_upgrades", label: "Release upgrade available" },
      { id: "consecutive_errors", label: "Consecutive errors" },
      { id: "is_inconsistent", label: "Inconsistent" },
      {
        id: "ubuntu_pro_subscription_type",
        label: "Ubuntu Pro subscription type",
      },
      { id: "ubuntu_pro_reboot_required_info", label: "Pro reboot info" },
      { id: "vm_info", label: "VM type" },
      { id: "container_info", label: "Container type" },
      { id: "wsl", label: "WSL instance" },
      { id: "wsl_profiles", label: "WSL profiles" },
      { id: "parent", label: "Parent instance" },
      { id: "children", label: "Child instances" },
      { id: "num_child", label: "Child instance count" },
      { id: "default_child", label: "Default child" },
      { id: "is_default_child", label: "Is default child" },
      { id: "create_instance_supported", label: "Instance creation supported" },
      { id: "clone_id", label: "Clone ID" },
      { id: "hardware_cpu_model", label: "CPU model" },
      { id: "hardware_cpu_vendor", label: "CPU vendor" },
      { id: "hardware_memory_size", label: "Memory size (Hardware)" },
      { id: "total_swap", label: "Total swap" },
      { id: "hardware_system_serial", label: "System serial" },
      { id: "hardware_system_vendor", label: "System vendor" },
      { id: "hardware_system_model", label: "System model" },
      { id: "mount_device", label: "Mount device" },
      { id: "mount_point", label: "Mount point" },
      { id: "mount_filesystem", label: "Filesystem type" },
      { id: "mount_total_space", label: "Total space" },
      { id: "network_broadcast_address", label: "Broadcast address" },
      { id: "network_netmask", label: "Netmask" },
      { id: "network_speed", label: "Speed" },
      { id: "network_duplex", label: "Duplex" },
      { id: "registered_at", label: "Registered at" },
      { id: "last_exchange_time", label: "Last exchange time" },
      { id: "last_exchange_duration", label: "Last exchange duration" },
      { id: "last_exchange_size", label: "Last exchange size" },
      { id: "availability_zone", label: "Availability zone" },
      { id: "juju_model_uuid", label: "Juju model UUID" },
    ],
  },
];
