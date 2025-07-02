import type { FC, ReactNode } from "react";
import classNames from "classnames";
import classes from "./PageMain.module.scss";

interface PageMainProps {
  readonly children: ReactNode;
}

const PageMain: FC<PageMainProps> = ({ children }) => {
  return (
    <div className={classNames("p-panel", classes.wrapper)}>{children}</div>
  );
};

export default PageMain;
