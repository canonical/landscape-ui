import type { ComponentProps, FC, ReactNode } from "react";
import InfoItem from "../InfoItem";
import classes from "./Menu.module.scss";

interface MenuProps {
  readonly children: ReactNode;
}

interface RowProps {
  readonly children: ReactNode;
}

type ItemProps = ComponentProps<typeof InfoItem> & {
  readonly size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

const Menu: FC<MenuProps> & { Row: FC<RowProps> & { Item: FC<ItemProps> } } = ({
  children,
}: MenuProps) => <div className={classes.menu}>{children}</div>;

const Row: FC<RowProps> & { Item: FC<ItemProps> } = ({
  children,
}: RowProps) => <div className={classes.row}>{children}</div>;

const Item: FC<ItemProps> = ({ size, ...props }) => (
  <InfoItem style={{ gridColumn: `span ${size}` }} {...props} />
);

Row.Item = Item;
Menu.Row = Row;
export default Menu;
