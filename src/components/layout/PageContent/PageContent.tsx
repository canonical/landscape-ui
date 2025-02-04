import type { FC } from "react";
import React from "react";
import classNames from "classnames";
import classes from "./PageContent.module.scss";
import type { PageContentProps } from "./types";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";

const PageContent: FC<PageContentProps> = ({
  children,
  container = "fluid",
  align = "center",
}) => {
  return (
    <div className={classNames("p-panel__content", classes.outerDiv)}>
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
