import type { WslInstanceType } from "@/features/wsl";
import type { InstanceChild } from "@/types/Instance";

export const wslInstanceNames: WslInstanceType[] = [
  { name: "Ubuntu", label: "Ubuntu" },
  { name: "Ubuntu-22.04", label: "Ubuntu 22.04" },
  { name: "Ubuntu-24.04", label: "Ubuntu 24.04" },
];

export const compliantInstanceChild: InstanceChild = {
  name: "WSL instance created via WSL profile, installed, registered",
  computer_id: 5,
  version_id: "Ubuntu 22.04",
  compliance: "compliant",
  profile: "WSL Profile 1",
  is_running: true,
  installed: true,
  registered: true,
  default: true,
};

export const noncompliantInstanceChild: InstanceChild = {
  name: "WSL instance associated with profile, not installed, installation not in progress",
  computer_id: null,
  version_id: "Ubuntu 22.04",
  compliance: "noncompliant",
  profile: "WSL Profile 4",
  is_running: false,
  installed: false,
  registered: false,
  default: null,
};

export const uninstalledInstanceChild: InstanceChild = {
  name: "WSL instance associated with profile, not installed, installation in progress",
  computer_id: null,
  version_id: "Ubuntu 22.04",
  compliance: "uninstalled",
  profile: "WSL Profile 2",
  is_running: false,
  installed: false,
  registered: false,
  default: null,
};

export const instanceChildren: InstanceChild[] = [
  compliantInstanceChild,
  uninstalledInstanceChild,
  {
    name: "WSL instance associated with profile, installed, registration in progress",
    computer_id: null,
    version_id: "Ubuntu 22.04",
    compliance: "unregistered",
    profile: "WSL Profile 3",
    is_running: false,
    installed: true,
    registered: false,
    default: null,
  },
  noncompliantInstanceChild,
  {
    name: "WSL instance not created via Landscape, not conflicting with any profile",
    computer_id: null,
    version_id: "Ubuntu 22.04",
    compliance: "compliant",
    profile: null,
    is_running: false,
    installed: true,
    registered: false,
    default: false,
  },
  {
    name: "WSL instance not created via Landscape, conflicting with a profile",
    computer_id: null,
    version_id: "Ubuntu 22.04",
    compliance: "noncompliant",
    profile: "WSL Profile 2",
    is_running: false,
    installed: true,
    registered: false,
    default: false,
  },
  {
    name: "WSL instance created via Landscape without a WSL profile, registered, not conflicting with any profile",
    computer_id: 6,
    version_id: "Ubuntu 22.04",
    compliance: "compliant",
    profile: null,
    is_running: false,
    installed: true,
    registered: true,
    default: false,
  },
  {
    name: "WSL instance created via Landscape without a WSL profile, registered, conflicting with any profile",
    computer_id: 7,
    version_id: "Ubuntu 22.04",
    compliance: "noncompliant",
    profile: "WSL Profile 1",
    is_running: false,
    installed: true,
    registered: true,
    default: false,
  },
];
