import { FC, ReactNode } from "react";
import classNames from "classnames";
import classes from "./PageContent.module.scss";

interface PageContentProps {
  children: ReactNode;
}

const PageContent: FC<PageContentProps> = ({ children }) => {
  return (
    <div className={classNames("p-panel__content", classes.outerDiv)}>
      <div className={classNames("p-panel__inner", classes.innerDiv)}>
        {children}
      </div>
    </div>
  );
};

export default PageContent;
