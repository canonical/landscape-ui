import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./Item.module.scss";
import { useBlocksSpaced } from "../Blocks";

export interface ItemProps {
  readonly children: ReactNode;
  readonly title?: string;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
}

const Item: FC<ItemProps> = ({
  children,
  title,
  description,
  action,
}: ItemProps) => {
  const spaced = useBlocksSpaced();
  return (
    <section className={classes.item}>
      {(title || description || action) && (
        <div
          className={classNames(classes.heading, {
            [classes.spacedHeading as string]: spaced,
          })}
        >
          {title && (
            <h4
              className={classNames(
                {
                  [classes.titleWithDescription as string]: !!description,
                },
                "p-heading--5 p-text--small-caps u-no-padding",
              )}
            >
              {title}
            </h4>
          )}
          {description && (
            <p
              className={classNames(
                "p-text--small u-text--muted",
                classes.description,
              )}
            >
              {description}
            </p>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
};

export default Item;
