import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Suspense } from "react";
import AutoinstallFileDetails from "../components/AutoinstallFileDetails";
import AutoinstallFileSidePanelTitle from "../components/AutoinstallFileSidePanelTitle";
import type { AutoinstallFile, AutoinstallFileTabId } from "../types";

const useOpenAutoinstallFileDetails = () => {
  const { setSidePanelContent } = useSidePanel();
  const { setPageParams } = usePageParams();

  return (
    autoinstallFile: AutoinstallFile,
    tabId?: AutoinstallFileTabId,
  ): void => {
    setSidePanelContent(
      <AutoinstallFileSidePanelTitle file={autoinstallFile} />,
      <Suspense fallback={<LoadingState />}>
        <AutoinstallFileDetails autoinstallFile={autoinstallFile} />
      </Suspense>,
    );
    setPageParams({ tabSlots: { panel: tabId ?? "" } });
  };
};

export default useOpenAutoinstallFileDetails;
