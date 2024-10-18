import { FC } from "react";
import { KernelOverviewInfo } from "../../types";
import { Col, Icon, Row, Tooltip } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import {
  getLivepatchCoverageDisplayValue,
  getLivepatchCoverageIcon,
  getStatusIcon,
  getStatusTooltipMessage,
} from "./helpers";
import classes from "./KernelOverview.module.scss";
import classNames from "classnames";
import NoData from "@/components/layout/NoData";

interface KernelHeaderProps {
  kernelOverview: KernelOverviewInfo;
}

const KernelOverview: FC<KernelHeaderProps> = ({ kernelOverview }) => {
  const livepatchEnabled = kernelOverview.status !== "Livepatch disabled";

  const infoItems = [
    {
      label: "current kernel version",
      value: kernelOverview.currentVersion || <NoData />,
    },
    {
      label: "kernel status",
      value: (
        <>
          <span>
            {!livepatchEnabled
              ? "Not covered by Livepatch"
              : kernelOverview.status || <NoData />}
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
      value: getLivepatchCoverageDisplayValue(
        livepatchEnabled,
        kernelOverview.expirationDate,
      ),
    },
  ];

  return (
    <Row
      className={classNames(
        "u-no-padding--left u-no-padding--right u-no-max-width",
        classes.container,
      )}
    >
      {infoItems.map(({ label, value }) => (
        <Col size={3} key={label}>
          {label === "status" && (
            <Icon
              name={getStatusIcon(kernelOverview.status)}
              aria-hidden
              className={classes.statusIcon}
            />
          )}
          {label === "livepatch coverage" && (
            <Icon
              name={getLivepatchCoverageIcon(
                livepatchEnabled,
                kernelOverview.expirationDate,
              )}
              aria-hidden
              className={classes.statusIcon}
            />
          )}
          <InfoItem label={label} value={value} />
        </Col>
      ))}
    </Row>
  );
};

export default KernelOverview;
