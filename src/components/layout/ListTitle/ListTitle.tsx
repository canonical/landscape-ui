import type { FC, ReactNode } from "react";
import classes from "./ListTitle.module.scss";

interface ListTitleProps {
  readonly children: ReactNode;
}

const ListTitle: FC<ListTitleProps> = ({ ...props }) => {
  return <div className={classes.cell} {...props} />;
};

export default ListTitle;
