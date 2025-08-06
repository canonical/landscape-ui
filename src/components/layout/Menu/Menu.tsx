import type { FC, ReactNode } from "react";
import classes from "./Menu.module.scss";

interface MenuProps {
  readonly children: ReactNode;
}

const Menu: FC<MenuProps> = ({ children }: MenuProps) => (
  <div className={classes.menu}>{children}</div>
);

export default Menu;
