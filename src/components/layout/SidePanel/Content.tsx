import { SidePanel } from "@canonical/react-components";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import classes from "./SidePanel.module.scss";

const Content: FC<ComponentProps<typeof SidePanel.Content>> = ({
  className,
  children,
  ...props
}) => (
  <SidePanel.Content
    className={classNames(classes.content, className)}
    {...props}
  >
    <div className={classes.inner}>{children}</div>
  </SidePanel.Content>
);

export default Content;
