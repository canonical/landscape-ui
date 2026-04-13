import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./Item.module.scss";

export interface ItemProps {
  readonly children: ReactNode;
  readonly title?: string;
  readonly titleClassName?: string;
  readonly containerClassName?: string;
}

const Item: FC<ItemProps> = ({
  children,
  title,
  titleClassName,
  containerClassName,
}: ItemProps) => (
  <section className={classNames(classes.item, containerClassName)}>
    {title && (
      <h4
        className={classNames(classes.heading, "p-heading--5", titleClassName)}
      >
        {title}
      </h4>
    )}
    {children}
  </section>
);

export default Item;
