import LoadingState from "@/components/layout/LoadingState";
import { useGetInstanceChildren } from "@/features/instances";
import {
  useGetWslLimits,
  WslInstanceList,
  WslInstancesEmptyState,
} from "@/features/wsl";
import type { WindowsInstance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import { Notification } from "@canonical/react-components";
import type { FC } from "react";

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

  if (isLoadingWslInstances) {
    return <LoadingState />;
  } else if (!wslInstances) {
    throw new Error(wslInstancesError?.message);
  } else if (!wslInstances.length) {
    return <WslInstancesEmptyState />;
  } else if (isGettingWslLimits) {
    return <LoadingState />;
  } else {
    return (
      <>
        {wslInstances.length >= windowsInstanceChildLimit && (
          <Notification inline title="Limit reached:" severity="caution">
            You&apos;ve reached the limit of {windowsInstanceChildLimit} active
            WSL child {pluralize(windowsInstanceChildLimit, "instance")}. This
            may be due to too many associated profiles or manually created
            instances.
          </Notification>
        )}

        <WslInstanceList
          wslInstances={wslInstances}
          windowsInstance={instance}
        />
      </>
    );
  }
};

export default WslPanel;
