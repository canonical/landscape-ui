import ContentBase from "@canonical/react-components/dist/components/SidePanel/common/Content";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import classes from "./SidePanel.module.scss";

const Content: FC<ComponentProps<typeof ContentBase>> = ({
  className,
  ...props
}) => (
  <ContentBase className={classNames(classes.content, className)} {...props} />
);

export default Content;
