import { createContext, useContext, type FC, type ReactNode } from "react";
import classes from "./Blocks.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";

interface BlocksProps {
  readonly children: ReactNode;
  readonly spaced?: boolean;
}

export const BlocksSpacedContext = createContext(false);
export const useBlocksSpaced = () => useContext(BlocksSpacedContext);

const Blocks: FC<BlocksProps> & { Item: FC<ItemProps> } = ({
  children,
  spaced = false,
}: BlocksProps) => (
  <BlocksSpacedContext.Provider value={spaced}>
    <div className={classes.blocks}>{children}</div>
  </BlocksSpacedContext.Provider>
);

Blocks.Item = Item;
export default Blocks;
