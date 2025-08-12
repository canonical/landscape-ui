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

      {action === "add" && (
        <SidePanel close={close} key="add">
          <ScriptProfileAddSidePanel />
        </SidePanel>
      )}

      {(action === "edit" || action === "view/edit") && (
        <SidePanel close={close} key="edit">
          <ScriptProfileEditSidePanel hasBackButton={action === "view/edit"} />
        </SidePanel>
      )}

      {action === "view" && (
        <SidePanel close={close} key="view">
          <ScriptProfileDetailsSidePanel />
        </SidePanel>
      )}
    </>
  );
};

export default ScriptProfilesTab;
