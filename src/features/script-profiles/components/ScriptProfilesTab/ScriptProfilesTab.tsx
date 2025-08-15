import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { lazy, type FC } from "react";
import ScriptProfilesPanel from "../ScriptProfilesPanel";

const ScriptProfileAddSidePanel = lazy(
  () => import("../ScriptProfileAddSidePanel"),
);

const ScriptProfileEditSidePanel = lazy(
  () => import("../ScriptProfileEditSidePanel"),
);

const ScriptProfileDetailsSidePanel = lazy(
  () => import("../ScriptProfileDetails"),
);

const ScriptProfilesTab: FC = () => {
  const { action, setPageParams } = usePageParams();

  const close = () => {
    setPageParams({ action: "", scriptProfile: -1 });
  };

  return (
    <>
      <ScriptProfilesPanel />

      <SidePanel onClose={close} isOpen={!!action}>
        {action === "add" && (
          <SidePanel.Suspense key="add">
            <ScriptProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {(action === "edit" || action === "view/edit") && (
          <SidePanel.Suspense key="edit">
            <ScriptProfileEditSidePanel
              hasBackButton={action === "view/edit"}
            />
          </SidePanel.Suspense>
        )}

        {action === "view" && (
          <SidePanel.Suspense key="view">
            <ScriptProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default ScriptProfilesTab;
