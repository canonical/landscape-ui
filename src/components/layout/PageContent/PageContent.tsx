import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import classNames from "classnames";
import type { FC } from "react";
import classes from "./PageContent.module.scss";
import type { PageContentProps } from "./types";

const PageContent: FC<PageContentProps> = ({ children }) => {
  return (
    <div className="p-panel__content">
      <div
        className={classNames("u-fixed-width u-no-max-width", classes.innerDiv)}
      >
        <AppErrorBoundary>{children}</AppErrorBoundary>
      </div>
    </div>
  );
};

export default PageContent;
