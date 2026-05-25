import classNames from "classnames";
import type { FC, HTMLAttributes, ReactNode } from "react";
import classes from "./InfoGrid.module.scss";
import type { ItemProps } from "./Item";
import Item from "./Item";

export interface InfoGridProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
  readonly spaced?: boolean;
  readonly dense?: boolean;
}

const InfoGrid: FC<InfoGridProps> & { Item: FC<ItemProps> } = ({
  className,
  spaced,
  dense,
  ...props
}: InfoGridProps) => (
  <div
    className={classNames(
      classes.infoGrid,
      { [classes.spacedInfoGrid as string]: spaced },
      className,
    )}
  >
    <div
      className={classNames(classes.grid, {
        [classes.denseGrid as string]: dense,
      })}
      {...props}
    />
  </div>
);

InfoGrid.Item = Item;
export default InfoGrid;
