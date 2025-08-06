import type { FC, ReactNode } from "react";
import classes from "./Grid.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";

export interface GridProps {
  readonly children: ReactNode;
}

const Grid: FC<GridProps> & { Item: FC<ItemProps> } = ({
  children,
}: GridProps) => <div className={classes.grid}>{children}</div>;

Grid.Item = Item;
export default Grid;
