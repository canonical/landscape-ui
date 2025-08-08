import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./Item.module.scss";

export interface ItemProps {
  readonly children: ReactNode;
  readonly title?: string;
}

const Item: FC<ItemProps> = ({ children, title }: ItemProps) => (
  <section className={title ? classes.dividedItem : classes.item}>
    {title && (
      <h4 className={classNames(classes.heading, "p-heading--5")}>{title}</h4>
    )}
    {children}
  </section>
);

export default Item;
