import { FC, ReactNode } from "react";
import useNotify from "../../hooks/useNotify";
import useSidePanel from "../../hooks/useSidePanel";
import AppNotification from "./AppNotification";
import classNames from "classnames";
import classes from "./PageContent.module.scss";

interface PageContentProps {
  children: ReactNode;
}

const PageContent: FC<PageContentProps> = ({ children }) => {
  const notify = useNotify();
  const { isSidePanelOpen } = useSidePanel();

  return (
    <div className={classNames("p-panel__content", classes.outerDiv)}>
      <div className={classNames("p-panel__inner", classes.innerDiv)}>
        {!isSidePanelOpen && <AppNotification notify={notify} />}
        {children}
      </div>
    </div>
  );
};

export default PageContent;
