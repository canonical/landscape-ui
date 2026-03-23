import { SidePanel } from "@canonical/react-components";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import classes from "./SidePanel.module.scss";

const Content: FC<ComponentProps<typeof SidePanel.Content>> = ({
  className,
  ...props
}) => (
  <SidePanel.Content
    className={classNames(classes.content, className)}
    {...props}
  />
);

export default Content;
