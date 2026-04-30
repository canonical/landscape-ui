import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./Item.module.scss";
import { useBlocksDense } from "../Blocks";

export interface ItemProps {
  readonly children: ReactNode;
  readonly title?: string;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
  readonly titleClassName?: string;
  readonly containerClassName?: string;
}

const Item: FC<ItemProps> = ({
  children,
  title,
  description,
  action,
  titleClassName,
  containerClassName,
}: ItemProps) => {
  const dense = useBlocksDense();
  return (
    <section className={classNames(classes.item, containerClassName)}>
      {(title || description || action) && (
        <div
          className={classNames(classes.heading, {
            [classes.denseHeading as string]: dense,
          })}
        >
          {title && (
            <h4
              className={classNames(
                {
                  [classes.titleWithDescription as string]: !!description,
                },
                "p-heading--5 p-text--small-caps u-no-padding",
                titleClassName,
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
