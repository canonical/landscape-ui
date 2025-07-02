import { Card, Icon } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import classes from "./Flow.module.scss";

interface FlowCardProps {
  readonly iconName: string;
  readonly description?: ReactNode;
  readonly header?: ReactNode;
  readonly children?: ReactNode;
}

interface FlowProps {
  readonly cards: FlowCardProps[];
}

const Flow: FC<FlowProps> = ({ cards }) => {
  return (
    <>
      <div className={classes.smallCard}>Start</div>
      <div className={classes.line} />

      {cards.map((card, key) => (
        <div key={key}>
          <Card className={"u-no-margin--bottom"}>
            <div>
              <div className={classes.header}>
                <Icon name={card.iconName} className={classes.cardIcon} />

                <p className="u-no-margin--bottom u-no-padding--top">
                  <strong>{card.header}</strong>
                </p>
              </div>

              <div className={classes.body}>
                <p className="u-no-margin--bottom u-no-padding--top">
                  <small className={classes.description}>
                    {card.description}
                  </small>
                </p>

                {card.children}
              </div>
            </div>
          </Card>

          <div className={classes.line} />
        </div>
      ))}

      <div className={classes.smallCard}>End</div>
    </>
  );
};

export default Flow;
