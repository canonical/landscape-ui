import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { Col, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import classes from "./HardwareInfoRow.module.scss";

interface InfoBlock {
  label: string;
  value: ReactNode;
}

interface HardwareInfoRowProps {
  readonly infoRowLabel: string;
  readonly infoBlocksArray: InfoBlock[][];
}

const HardwareInfoRow: FC<HardwareInfoRowProps> = ({
  infoRowLabel,
  infoBlocksArray,
}) => {
  return (
    <div
      className={classNames(
        "p-strip u-no-padding--bottom u-no-padding--top u-no-max-width",
        classes.wrapper,
      )}
    >
      <h3 className={classNames("p-heading--4", classes.blockTitle)}>
        {infoRowLabel}
      </h3>
      <div className={classes.infoRows}>
        {infoBlocksArray.map((infoBlocks, index) => (
          <div
            key={index}
            className={classNames("p-strip u-no-max-width", classes.infoRow)}
          >
            <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
              {infoBlocks.map(({ label, value }, index) => (
                <Col size={3} key={index}>
                  <InfoItem label={label} value={value} />
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HardwareInfoRow;
