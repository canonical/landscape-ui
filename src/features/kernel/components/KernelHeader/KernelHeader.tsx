import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type { KernelManagementInfo } from "../../types";
import classes from "./KernelHeader.module.scss";
import { ResponsiveButtons } from "@/components/ui";

interface KernelHeaderProps {
  readonly instanceName: string;
  readonly hasTableData: boolean;
  readonly kernelStatuses: KernelManagementInfo;
}

const KernelHeader: FC<KernelHeaderProps> = ({
  kernelStatuses,
}) => {
  const { createSidePathPusher } = usePageParams();

  const downgradeKernelVersions = kernelStatuses?.downgrades ?? [];
  const upgradeKernelVersions = kernelStatuses?.upgrades ?? [];

  const handleDowngradeKernel = createSidePathPusher("downgrade");
  const handleUpgradeKernel = createSidePathPusher("upgrade");
  const handleRestartInstance = createSidePathPusher("restart");

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
