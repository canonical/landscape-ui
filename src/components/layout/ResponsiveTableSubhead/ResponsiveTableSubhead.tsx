import type { FC, ReactNode } from "react";
import classes from "./ResponsiveTableSubhead.module.scss";

interface ResponsiveTableSubheadProps {
  readonly children: ReactNode;
}

const ResponsiveTableSubhead: FC<ResponsiveTableSubheadProps> = (props) => {
  return <div className={classes.subhead} {...props} />;
};

export default ResponsiveTableSubhead;
