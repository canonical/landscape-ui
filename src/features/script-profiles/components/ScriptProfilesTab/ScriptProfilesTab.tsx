import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy, type FC } from "react";
import ScriptProfilesPanel from "../ScriptProfilesPanel";

const ScriptProfileAddSidePanel = lazy(
  () => import("../ScriptProfileAddSidePanel"),
);

const ScriptProfileEditSidePanel = lazy(
  () => import("../ScriptProfileEditSidePanel"),
);

const ScriptProfileDetails = lazy(
  () => import("../ScriptProfileDetailsSidePanel"),
);

const ScriptProfilesTab: FC = () => {
  const { sidePath, lastSidePathSegment, setPageParams } = usePageParams();

  const close = () => {
    setPageParams({ sidePath: [], profile: "" });
  };

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  return (
    <>
      <ScriptProfilesPanel />

      <SidePanel onClose={close} isOpen={!!sidePath.length}>
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <ScriptProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <ScriptProfileEditSidePanel />
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
