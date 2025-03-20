import type { FC, ReactNode } from "react";
import classes from "./Indent.module.scss";

interface IndentProps {
  readonly children: ReactNode;
}

const Indent: FC<IndentProps> = ({ children }) => {
  return <div className={classes.indent}>{children}</div>;
};

export default Indent;
