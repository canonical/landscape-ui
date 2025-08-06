import type { FC, ReactNode } from "react";
import classes from "./Item.module.scss";

export interface ItemProps {
  readonly children: ReactNode;
  readonly title?: string;
}

const Item: FC<ItemProps> = ({ children, title }: ItemProps) => {
  const isTitleDefined = title !== undefined;

  return (
    <section className={isTitleDefined ? classes.dividedItem : classes.item}>
      {isTitleDefined && <h5 className={classes.heading}>{title}</h5>}
      {children}
    </section>
  );
};

export default Item;
