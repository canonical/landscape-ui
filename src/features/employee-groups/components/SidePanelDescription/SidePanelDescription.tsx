import type { FC, ReactNode } from "react";
import classes from "./SidePanelDescription.module.scss";

const SidePanelDescription: FC<{ readonly children: ReactNode }> = ({
  children,
}) => <p className={classes.root}>{children}</p>;

export default SidePanelDescription;
