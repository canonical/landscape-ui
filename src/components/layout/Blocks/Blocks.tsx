import classNames from "classnames";
import { type FC, type ReactNode } from "react";
import classes from "./Blocks.module.scss";

interface BlocksProps {
  readonly children: ReactNode;
}

interface ItemProps {
  readonly children: ReactNode;
  readonly title?: string;
}

const Blocks: FC<BlocksProps> & { Item: FC<ItemProps> } = ({
  children,
}: BlocksProps) => <div className={classes.blocks}>{children}</div>;

const Item: FC<ItemProps> = ({ children, title }: ItemProps) => {
  const isTitleDefined = title !== undefined;

  return (
    <section
      className={classNames({
        [classes.block]: !isTitleDefined,
        [classes.dividedBlock]: isTitleDefined,
      })}
    >
      {isTitleDefined && <h5 className={classes.heading}>{title}</h5>}
      {children}
    </section>
  );
};

Blocks.Item = Item;

export default Blocks;
