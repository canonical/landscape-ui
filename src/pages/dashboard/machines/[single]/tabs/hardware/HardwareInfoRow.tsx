import { FC } from "react";
import { Col, Row } from "@canonical/react-components";
import classes from "./HardwareInfoRow.module.scss";
import InfoItem from "../../../../../../components/layout/InfoItem";
import classNames from "classnames";

interface InfoBlock {
  label: string;
  value: string;
}

interface HardwareInfoRowProps {
  infoRowLabel: string;
  infoBlocksArray: InfoBlock[][];
}

const HardwareInfoRow: FC<HardwareInfoRowProps> = ({
  infoRowLabel,
  infoBlocksArray,
}) => {
  return (
    <div
      className={classNames(
        "p-strip is-bordered u-no-padding--bottom u-no-padding--top u-no-max-width",
        classes.wrapper,
      )}
    >
      <h4 className={classes.blockTitle}>{infoRowLabel}</h4>
      <div className={classes.infoRows}>
        {infoBlocksArray.map((infoBlocks, index) => (
          <div
            key={index}
            className={classNames(
              "p-strip is-bordered u-no-max-width",
              classes.infoRow,
            )}
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
