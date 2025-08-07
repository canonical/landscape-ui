import classNames from "classnames";
import type { FC, HTMLAttributes, ReactNode } from "react";
import classes from "./InfoGrid.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";

export interface InfoGridProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
}

const InfoGrid: FC<InfoGridProps> & { Item: FC<ItemProps> } = ({
  className,
  ...props
}: InfoGridProps) => (
  <div className={classNames(classes.infoGrid, className)}>
    <div className={classes.grid} {...props} />
  </div>
);

InfoGrid.Item = Item;
export default InfoGrid;
