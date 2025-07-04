import type { Instance } from "@landscape/types";
import type { FC } from "react";
import classes from "./InfoPanel.module.scss";
import { InfoItem } from "@landscape/ui";
import { Col, Row } from "@canonical/react-components";
import { getInstanceInfoItems } from "./helpers";

interface InfoPanelProps {
  readonly instance: Instance;
}

const InfoPanel: FC<InfoPanelProps> = ({ instance }) => {
  return (
    <>
      <div className={classes.titleRow}>
        <div className={classes.flexContainer}>
          <h2 className="p-heading--4 u-no-padding--top u-no-margin--bottom">
            {instance.title}
          </h2>
        </div>
      </div>
      <div className={classes.infoRow}>
        <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
          {getInstanceInfoItems(instance).map((item) => (
            <Col size={4} key={item.label}>
              <InfoItem {...item} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default InfoPanel;
