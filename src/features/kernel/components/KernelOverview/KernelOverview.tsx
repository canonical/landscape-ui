import InfoGrid from "@/components/layout/InfoGrid";
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

  return (
    <InfoGrid>
      <InfoGrid.Item
        label="current kernel version"
        size={3}
        value={kernelOverview.currentVersion || null}
      />

      <InfoGrid.Item
        label="kernel status"
        size={3}
        value={
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
        }
      />

      <InfoGrid.Item
        label="livepatch coverage"
        size={3}
        value={
          kernelOverview.expirationDate ? (
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
          ) : null
        }
      />
    </InfoGrid>
  );
};

export default KernelOverview;
