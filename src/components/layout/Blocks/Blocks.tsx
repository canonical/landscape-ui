import { createContext, useContext, type FC, type ReactNode } from "react";
import classes from "./Blocks.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";

interface BlocksProps {
  readonly children: ReactNode;
  readonly dense?: boolean;
}

export const BlocksDenseContext = createContext(false);
export const useBlocksDense = () => useContext(BlocksDenseContext);

const Blocks: FC<BlocksProps> & { Item: FC<ItemProps> } = ({
  children,
  dense = false,
}: BlocksProps) => (
  <BlocksDenseContext.Provider value={dense}>
    <div className={classes.blocks}>{children}</div>
  </BlocksDenseContext.Provider>
);

Blocks.Item = Item;
export default Blocks;
