import type { FC, HTMLAttributes, ReactNode } from "react";
import classes from "./InfoGrid.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";
import classNames from "classnames";

export interface InfoGridProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
}

const InfoGrid: FC<InfoGridProps> & { Item: FC<ItemProps> } = ({
  className,
  ...props
}: InfoGridProps) => (
  <div className={classNames(classes.infoGrid, className)} {...props} />
);

InfoGrid.Item = Item;
export default InfoGrid;
