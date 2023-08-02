import { FC, ReactNode } from "react";
import useNotify from "../../hooks/useNotify";
import AppNotification from "./AppNotification";
import useSidePanel from "../../hooks/useSidePanel";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode[];
}

const PageHeader: FC<PageHeaderProps> = ({ title, actions = [] }) => {
  const notify = useNotify();
  const { isSidePanelOpen } = useSidePanel();

  return (
    <>
      <div className="p-panel__header">
        <h1 className="p-panel__title">{title}</h1>
        {actions.length > 0 && (
          <div className="p-panel__controls">{actions}</div>
        )}
      </div>
      {notify && !isSidePanelOpen && (
        <div className="row">
          <AppNotification notify={notify} />
        </div>
      )}
    </>
  );
};

export default PageHeader;
