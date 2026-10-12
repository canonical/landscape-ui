import { severityClass, type IconSeverity } from "@/libs/icons";
import type { IconName } from "@canonical/ds-assets";
import { Icon } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./TableIcon.module.scss";

interface TableIconProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly icon: IconName;
  readonly severity?: IconSeverity;
}

const TableIcon: FC<TableIconProps> = ({
  children,
  className,
  icon,
  severity,
}) => (
  <span className={classes.wrapper}>
    <span className={classes.iconSpan}>
      <Icon
        icon={icon}
        className={classNames(severityClass(severity), className)}
      />
    </span>
    {children}
  </span>
);

export default TableIcon;
