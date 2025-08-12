import classNames from "classnames";
import type { FC, HTMLAttributes, ReactNode } from "react";
import classes from "./InfoGrid.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";

export interface InfoGridProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
  readonly spaced?: boolean;
}

const InfoGrid: FC<InfoGridProps> & { Item: FC<ItemProps> } = ({
  className,
  spaced,
  ...props
}: InfoGridProps) => (
  <div
    className={classNames(
      classes.infoGrid,
      { [classes.spacedInfoGrid]: spaced },
      className,
    )}
  >
    <div className={classes.grid} {...props} />
  </div>
);

InfoGrid.Item = Item;
export default InfoGrid;
