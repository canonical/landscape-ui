import classNames from "classnames";
import type { FC, HTMLAttributes, ReactNode } from "react";
import classes from "./ActionBar.module.scss";

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
}

/**
 * Transitional wrapper for grouped Pragma action buttons (replacing Vanilla
 * `.p-segmented-control` action rows) while Pragma's `ActionBar`
 * (`ds:apps.pattern.action_bar`) is under design. Keeping spacing in one shared
 * component makes it straightforward to adjust layout or swap to the upstream
 * component once available.
 */
const ActionBar: FC<ActionBarProps> = ({ children, className, ...props }) => (
  <div className={classNames(classes.actionBar, className)} {...props}>
    {children}
  </div>
);

export default ActionBar;
