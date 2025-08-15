import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { lazy, type FC } from "react";
import ScriptProfilesPanel from "../ScriptProfilesPanel";

const ScriptProfileAddForm = lazy(() => import("../ScriptProfileAddForm"));

const ScriptProfileEditForm = lazy(() => import("../ScriptProfileEditForm"));

const ScriptProfileDetails = lazy(() => import("../ScriptProfileDetails"));

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
            <ScriptProfileAddForm />
          </SidePanel.Suspense>
        )}

        {(action === "edit" || action === "view/edit") && (
          <SidePanel.Suspense key="edit">
            <ScriptProfileEditForm hasBackButton={action === "view/edit"} />
          </SidePanel.Suspense>
        )}

        {action === "view" && (
          <SidePanel.Suspense key="view">
            <ScriptProfileDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default ScriptProfilesTab;
