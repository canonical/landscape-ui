import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import { Link } from "react-router";
import classes from "./StaticLink.module.scss";

type StaticLinkProps = ComponentProps<typeof Link>;

const StaticLink: FC<StaticLinkProps> = ({ className, ...props }) => {
  return <Link className={classNames(classes.link, className)} {...props} />;
};

export default StaticLink;
