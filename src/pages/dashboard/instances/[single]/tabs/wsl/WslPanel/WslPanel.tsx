import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { useGetInstanceChildren } from "@/features/instances";
import {
  useGetWslLimits,
  WslInstanceList,
  WslInstancesEmptyState,
} from "@/features/wsl";
import usePageParams from "@/hooks/usePageParams";
import type { WindowsInstance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import { Notification } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";

const WslInstanceInstallForm = lazy(
  async () => import("@/features/wsl/components/WslInstanceInstallForm"),
);

interface WslPanelProps {
  readonly instance: WindowsInstance;
}

const WslPanel: FC<WslPanelProps> = ({ instance }) => {
  const {
    instanceChildren: wslInstances,
    instanceChildrenError: wslInstancesError,
    isLoadingInstanceChildren: isLoadingWslInstances,
  } = useGetInstanceChildren({ computer_id: instance.id });

  const { isGettingWslLimits, windowsInstanceChildLimit } = useGetWslLimits();
  const { lastSidePathSegment, popSidePathUntilClear } = usePageParams();

  if (isLoadingWslInstances) {
    return <LoadingState />;
  } else if (!wslInstances) {
    throw new Error(wslInstancesError?.message);
  } else if (!wslInstances.length) {
    return (
      <>
        <WslInstancesEmptyState />
        <SidePanel
          isOpen={lastSidePathSegment === "install-wsl"}
          onClose={popSidePathUntilClear}
        >
          <SidePanel.Header>Create new WSL instance</SidePanel.Header>
          <SidePanel.Content>
            <SidePanel.Suspense>
              <WslInstanceInstallForm />
            </SidePanel.Suspense>
          </SidePanel.Content>
        </SidePanel>
      </>
    );
  } else if (isGettingWslLimits) {
    return <LoadingState />;
  } else {
    return (
      <>
        {wslInstances.length >= windowsInstanceChildLimit && (
          <Notification inline title="Limit reached:" severity="caution">
            You&apos;ve reached the limit of{" "}
            {pluralize(
              windowsInstanceChildLimit,
              ["active WSL child instance"],
              "exact",
            )}
            . This may be due to too many associated profiles or manually
            created instances.
          </Notification>
        )}

        <WslInstanceList
          wslInstances={wslInstances}
          windowsInstance={instance}
        />
        <SidePanel
          isOpen={lastSidePathSegment === "install-wsl"}
          onClose={popSidePathUntilClear}
        >
          <SidePanel.Header>Create new WSL instance</SidePanel.Header>
          <SidePanel.Content>
            <SidePanel.Suspense>
              <WslInstanceInstallForm />
            </SidePanel.Suspense>
          </SidePanel.Content>
        </SidePanel>
      </>
    );
  }
};

export default WslPanel;
