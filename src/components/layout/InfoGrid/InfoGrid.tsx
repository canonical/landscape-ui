import type { FC, ReactNode } from "react";
import classes from "./InfoGrid.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";

export interface InfoGridProps {
  readonly children: ReactNode;
}

const InfoGrid: FC<InfoGridProps> & { Item: FC<ItemProps> } = ({
  children,
}: InfoGridProps) => <div className={classes.infoGrid}>{children}</div>;

InfoGrid.Item = Item;
export default InfoGrid;
