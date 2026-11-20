import AppTabs from "@/components/AppTabs";
import useAuth from "@/hooks/useAuth";
import type { Instance, WindowsInstance } from "@/types/Instance";
import type { FC, ReactNode } from "react";
import { lazy } from "react";
import type { SingleInstanceTabId } from "./helpers";
import { getTabLinks } from "./helpers";

const InfoPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/info"),
);
const ProcessesPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/processes"),
);
const HardwarePanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/hardware"),
);
const PackagesPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/packages"),
);
const ActivityPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/activities"),
);
const KernelPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/kernel"),
);
const WslPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/wsl"),
);
const UserPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/users"),
);
const SecurityIssuesPanel = lazy(
  async () =>
    import("@/pages/dashboard/instances/[single]/tabs/security-issues"),
);
const UbuntuProPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/ubuntu-pro"),
);
const SnapsPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/snaps"),
);

interface SingleInstanceTabsProps {
  readonly instance: Instance;
  readonly packageCount: number | undefined;
  readonly packagesLoading: boolean;
  readonly usnCount: number | undefined;
  readonly usnLoading: boolean;
  readonly kernelCount: number | undefined;
  readonly kernelLoading: boolean;
}

const SingleInstanceTabs: FC<SingleInstanceTabsProps> = ({
  instance,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
  kernelCount,
  kernelLoading,
}) => {
  const { isFeatureEnabled } = useAuth();

  const panels: Record<SingleInstanceTabId, ReactNode> = {
    info: <InfoPanel instance={instance} />,
    wsl: <WslPanel instance={instance as WindowsInstance} />,
    activities: <ActivityPanel instanceId={instance.id} />,
    kernel: <KernelPanel instanceTitle={instance.title} />,
    "security-issues": <SecurityIssuesPanel instance={instance} />,
    packages: <PackagesPanel />,
    snaps: <SnapsPanel />,
    processes: <ProcessesPanel />,
    "ubuntu-pro": <UbuntuProPanel instance={instance} />,
    users: <UserPanel />,
    hardware: <HardwarePanel instance={instance} />,
  };

  const items = getTabLinks({
    instance,
    isFeatureEnabled,
    packageCount,
    packagesLoading,
    usnCount,
    usnLoading,
    kernelCount,
    kernelLoading,
  }).map((item) => ({ ...item, panel: panels[item.id] }));

  return <AppTabs aria-label="Instance details" items={items} />;
};

export default SingleInstanceTabs;
