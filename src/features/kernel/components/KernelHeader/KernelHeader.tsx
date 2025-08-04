import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import type { KernelManagementInfo } from "../../types";
import classes from "./KernelHeader.module.scss";

const DowngradeKernelForm = lazy(async () => import("../DowngradeKernelForm"));
const UpgradeKernelForm = lazy(async () => import("../UpgradeKernelForm"));
const RestartInstanceForm = lazy(async () => import("../RestartInstanceForm"));

interface KernelHeaderProps {
  readonly instanceName: string;
  readonly hasTableData: boolean;
  readonly kernelStatuses: KernelManagementInfo;
}

const KernelHeader: FC<KernelHeaderProps> = ({
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
      <h2 className="p-heading--4 u-no-padding--top u-no-margin--bottom">
        Kernel overview
      </h2>
      <ResponsiveButtons
        collapseFrom="lg"
        buttons={[
          <Button
            key="restart-instance"
            hasIcon
            className="p-segmented-control__button"
            onClick={handleRestartInstance}
          >
            <Icon name="restart" />
            <span>Restart instance</span>
          </Button>,

          <Button
            key="downgrade-kernel"
            hasIcon
            className="p-segmented-control__button"
            type="button"
            disabled={downgradeKernelVersions.length === 0}
            onClick={handleDowngradeKernel}
          >
            <Icon name="begin-downloading" />
            <span>Downgrade kernel</span>
          </Button>,

          <Button
            key="upgrade-kernel"
            hasIcon
            className="p-segmented-control__button"
            type="button"
            disabled={upgradeKernelVersions.length === 0}
            onClick={handleUpgradeKernel}
          >
            <Icon name="change-version" />
            <span>Upgrade kernel</span>
          </Button>,
        ]}
      />
    </div>
  );
};

export default KernelHeader;
