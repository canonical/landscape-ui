import type { ComponentProps, FC } from "react";
import Truncated from "../Truncated";
import classes from "./TruncatedCell.module.scss";

const TruncatedCell: FC<
  Omit<ComponentProps<typeof Truncated>, "expandedClassName">
> = (props) => <Truncated expandedClassName={classes.expanded} {...props} />;

export default TruncatedCell;
