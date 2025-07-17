import type { ComponentProps, FC } from "react";
import { Link } from "react-router";

type StaticLinkProps = ComponentProps<typeof Link>;

const StaticLink: FC<StaticLinkProps> = ({ className, ...props }) => {
  return <Link className={className} {...props} />;
};

export default StaticLink;
