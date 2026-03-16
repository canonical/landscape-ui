import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./Item.module.scss";

export interface ItemProps {
  readonly children: ReactNode;
  readonly title?: string;
}

const Item: FC<ItemProps> = ({ children, title }: ItemProps) => (
  <section className={classes.item}>
    {title && (
      <h4 className={classNames(classes.heading, "p-text--small-caps")}>
        {title}
      </h4>
    )}
    {children}
  </section>
);

export default Item;
