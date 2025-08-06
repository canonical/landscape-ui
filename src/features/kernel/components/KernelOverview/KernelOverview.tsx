import Grid from "@/components/layout/Grid";
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
    <Grid>
      <Grid.Item
        label="current kernel version"
        size={3}
        value={kernelOverview.currentVersion || null}
      />

      <Grid.Item
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

      <Grid.Item
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
    </Grid>
  );
};

export default KernelOverview;
