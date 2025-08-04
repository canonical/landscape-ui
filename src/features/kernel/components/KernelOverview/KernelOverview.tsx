import Menu from "@/components/layout/Menu";
import { Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import type { KernelOverviewInfo } from "../../types";
import {
  getLivepatchCoverageDisplayValue,
  getLivepatchCoverageIcon,
  getStatusTooltipMessage,
} from "./helpers";
import classes from "./KernelOverview.module.scss";

interface KernelHeaderProps {
  readonly kernelOverview: KernelOverviewInfo;
}

const KernelOverview: FC<KernelHeaderProps> = ({ kernelOverview }) => {
  const livepatchEnabled = kernelOverview.status !== "Livepatch disabled";

  const infoItems = [
    {
      label: "current kernel version",
      value: kernelOverview.currentVersion || null,
    },
    {
      label: "kernel status",
      value: (
        <>
          <span>
            {!livepatchEnabled
              ? "Not covered by Livepatch"
              : kernelOverview.status || null}
          </span>
          <Tooltip
            message={getStatusTooltipMessage(
              kernelOverview.status,
              kernelOverview.expirationDate,
            )}
            className={classes.tooltipIcon}
          >
            <Icon name="help" aria-hidden />
            <span className="u-off-screen">Help</span>
          </Tooltip>
        </>
      ),
    },
    {
      label: "livepatch coverage",
      value: kernelOverview.expirationDate ? (
        <>
          <Icon
            name={getLivepatchCoverageIcon(
              livepatchEnabled,
              kernelOverview.expirationDate,
            )}
            aria-hidden
            className={classes.statusIcon}
          />
          {getLivepatchCoverageDisplayValue(
            livepatchEnabled,
            kernelOverview.expirationDate,
          )}
        </>
      ) : null,
    },
  ];

  return <Menu items={infoItems.map((item) => ({ size: 3, ...item }))} />;
};

export default KernelOverview;
