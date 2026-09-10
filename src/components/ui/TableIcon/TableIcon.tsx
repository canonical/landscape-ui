import { ROOT_PATH } from "@/constants";
import {
  getIconRootPath,
  severityClass,
  type ApplicationIconName,
  type IconSeverity,
} from "@/libs/icons";
import type { IconName } from "@canonical/ds-assets";
import { Icon } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./TableIcon.module.scss";

const iconRootPath = getIconRootPath(ROOT_PATH);

interface TableIconProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly icon: IconName | ApplicationIconName;
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
        icon={icon as IconName}
        rootPath={iconRootPath}
        className={classNames(severityClass(severity), className)}
      />
    </span>
    {children}
  </span>
);

export default TableIcon;
