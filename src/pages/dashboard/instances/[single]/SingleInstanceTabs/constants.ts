import { getFeatures } from "@/features/instances";
import type { Instance } from "@/types/Instance";

export const TAB_LINKS: {
  label: string;
  id: string;
  condition: (instance: Instance) => boolean;
}[] = [
  {
    label: "Info",
    id: "tab-link-info",
    condition: () => true,
  },
  {
    label: "WSL",
    id: "tab-link-wsl",
    condition: (instance) => getFeatures(instance).wsl,
  },
  {
    label: "Activities",
    id: "tab-link-activities",
    condition: () => true,
  },
  {
    label: "Kernel",
    id: "tab-link-kernel",
    condition: (instance) => getFeatures(instance).packages,
  },
  {
    label: "Security issues",
    id: "tab-link-security-issues",
    condition: (instance) => getFeatures(instance).packages,
  },
  {
    label: "Packages",
    id: "tab-link-packages",
    condition: (instance) => getFeatures(instance).packages,
  },
  {
    label: "Snaps",
    id: "tab-link-snaps",
    condition: (instance) => getFeatures(instance).snaps,
  },
  {
    label: "Processes",
    id: "tab-link-processes",
    condition: (instance) => getFeatures(instance).processes,
  },
  {
    label: "Ubuntu Pro",
    id: "tab-link-ubuntu-pro",
    condition: (instance) => getFeatures(instance).pro,
  },
  {
    label: "Users",
    id: "tab-link-users",
    condition: (instance) => getFeatures(instance).users,
  },
  {
    label: "Hardware",
    id: "tab-link-hardware",
    condition: (instance) => getFeatures(instance).hardware,
  },
];
