import { type FC, type ReactNode } from "react";
import classes from "./Blocks.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";

interface BlocksProps {
  readonly children: ReactNode;
}

const Blocks: FC<BlocksProps> & { Item: FC<ItemProps> } = ({
  children,
}: BlocksProps) => <div className={classes.blocks}>{children}</div>;

Blocks.Item = Item;
export default Blocks;
