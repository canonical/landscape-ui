import { Card, Icon } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import classes from "./FlowCard.module.scss";

interface FlowCardProps {
  readonly children: ReactNode;
  readonly header: string;
  readonly iconName: string;
}

const FlowCard: FC<FlowCardProps> = ({ children, header, iconName }) => {
  return (
    <Card className={"u-no-margin--bottom"}>
      <div className={classes.container}>
        <div className={classes.header}>
          <Icon name={iconName} className={classes.cardIcon} />

          <p className="u-no-margin--bottom u-no-padding--top">
            <strong>{header}</strong>
          </p>
        </div>

        <div className={classes.body}>{children}</div>
      </div>
    </Card>
  );
};

export default FlowCard;
