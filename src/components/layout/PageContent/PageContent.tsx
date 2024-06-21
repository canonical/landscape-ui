import { FC } from "react";
import classNames from "classnames";
import classes from "./PageContent.module.scss";
import { PageContentProps } from "./types";

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
        {children}
      </div>
    </div>
  );
};

export default PageContent;
