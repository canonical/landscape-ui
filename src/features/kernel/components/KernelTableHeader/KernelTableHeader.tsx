import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import { FC, lazy, Suspense } from "react";
import { KernelManagementInfo } from "../../types";
import classes from "./KernelTableHeader.module.scss";

const DowngradeKernelForm = lazy(() => import("../DowngradeKernelForm"));
const UpgradeKernelForm = lazy(() => import("../UpgradeKernelForm"));
const RestartInstanceForm = lazy(() => import("../RestartInstanceForm"));

interface KernelTableHeaderProps {
  instanceName: string;
  hasTableData: boolean;
  kernelStatuses: KernelManagementInfo;
}

const KernelTableHeader: FC<KernelTableHeaderProps> = ({
  instanceName,
  hasTableData,
  kernelStatuses,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const currentKernelVersion = kernelStatuses?.installed?.version_rounded ?? "";
  const downgradeKernelVersions = kernelStatuses?.downgrades ?? [];
  const upgradeKernelVersions = kernelStatuses?.upgrades ?? [];

  const handleDowngradeKernel = () => {
    setSidePanelContent(
      "Downgrade kernel",
      <Suspense fallback={<LoadingState />}>
        <DowngradeKernelForm
          instanceName={instanceName}
          currentKernelVersion={currentKernelVersion}
          downgradeKernelVersions={downgradeKernelVersions}
        />
      </Suspense>,
    );
  };

  const handleUpgradeKernel = () => {
    setSidePanelContent(
      "Upgrade kernel",
      <Suspense fallback={<LoadingState />}>
        <UpgradeKernelForm
          instanceName={instanceName}
          currentKernelVersion={currentKernelVersion}
          upgradeKernelVersions={upgradeKernelVersions}
        />
      </Suspense>,
    );
  };

  const handleRestartInstance = () => {
    setSidePanelContent(
      `Restart ${instanceName}`,
      <Suspense fallback={<LoadingState />}>
        <RestartInstanceForm
          instanceName={instanceName}
          showNotification={hasTableData}
          newKernelVersionId={upgradeKernelVersions[0]?.id}
        />
      </Suspense>,
    );
  };

  return (
    <div className={classes.container}>
      <h5 className="u-no-padding u-no-margin">
        Patches discovered since last restart
      </h5>
      <div key="buttons" className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            hasIcon
            className="p-segmented-control__button"
            onClick={handleRestartInstance}
          >
            <Icon name="restart" />
            <span>Restart instance</span>
          </Button>

          <Button
            hasIcon
            className="p-segmented-control__button"
            type="button"
            disabled={downgradeKernelVersions.length === 0}
            onClick={handleDowngradeKernel}
          >
            <Icon name="begin-downloading" />
            <span>Downgrade kernel</span>
          </Button>

          <Button
            hasIcon
            className="p-segmented-control__button"
            type="button"
            disabled={upgradeKernelVersions.length === 0}
            onClick={handleUpgradeKernel}
          >
            <Icon name="change-version" />
            <span>Upgrade kernel</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KernelTableHeader;
