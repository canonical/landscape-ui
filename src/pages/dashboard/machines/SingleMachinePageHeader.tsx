import { FC } from "react";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";
import AppNotification from "../../../components/layout/AppNotification";
import useNotify from "../../../hooks/useNotify";
import useSidePanel from "../../../hooks/useSidePanel";

const SingleMachinePageHeader: FC = () => {
  const notify = useNotify();
  const { isSidePanelOpen } = useSidePanel();

  return (
    <>
      <div className="p-panel__header p-panel__controls">
        <Breadcrumbs />
      </div>
      {notify && !isSidePanelOpen && (
        <div className="row">
          <AppNotification notify={notify} />
        </div>
      )}
    </>
  );
};

export default SingleMachinePageHeader;
