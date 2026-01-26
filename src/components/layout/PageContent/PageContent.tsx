import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import classNames from "classnames";
import type { FC } from "react";
import classes from "./PageContent.module.scss";
import type { PageContentProps } from "./types";

const PageContent: FC<PageContentProps> = ({
  children,
  container = "fluid",
  align = "center",
  hasTable,
}) => {
  return (
    <div
      className={classNames("p-panel__content", classes.outerDiv, {
        [classes.hasTable]: hasTable,
      })}
    >
      <div
        className={classNames("p-panel__inner", classes.innerDiv, {
          [classes.alignCenter]: container === "medium" && align === "center",
          [classes.alignLeft]: container === "medium" && align === "left",
        })}
      >
        <AppErrorBoundary>{children}</AppErrorBoundary>
      </div>
    </div>
  );
};

export default PageContent;
