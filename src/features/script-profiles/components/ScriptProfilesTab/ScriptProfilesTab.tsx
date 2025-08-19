import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy, type FC } from "react";
import ScriptProfilesPanel from "../ScriptProfilesPanel";

const ScriptProfileAddForm = lazy(() => import("../ScriptProfileAddForm"));

const ScriptProfileEditForm = lazy(() => import("../ScriptProfileEditForm"));

const ScriptProfileDetails = lazy(() => import("../ScriptProfileDetails"));

const ScriptProfilesTab: FC = () => {
  const { sidePath, lastSidePathSegment, setPageParams } = usePageParams();

  const close = () => {
    setPageParams({ sidePath: [], scriptProfile: -1 });
  };

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  return (
    <>
      <ScriptProfilesPanel />

      <SidePanel onClose={close} isOpen={!!sidePath.length}>
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <ScriptProfileAddForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <ScriptProfileEditForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ScriptProfileDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default ScriptProfilesTab;
