import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Suspense } from "react";
import AutoinstallFileDetails from "../components/AutoinstallFileDetails";
import AutoinstallFileSidePanelTitle from "../components/AutoinstallFileSidePanelTitle";
import type { AutoinstallFile, AutoinstallFileTabId } from "../types";

const useOpenAutoinstallFileDetails = () => {
  const { setSidePanelContent } = useSidePanel();

  return (
    autoinstallFile: AutoinstallFile,
    initialTabId?: AutoinstallFileTabId,
  ): void => {
    setSidePanelContent(
      <AutoinstallFileSidePanelTitle file={autoinstallFile} />,
      <Suspense fallback={<LoadingState />}>
        <AutoinstallFileDetails
          initialTabId={initialTabId}
          autoinstallFile={autoinstallFile}
        />
      </Suspense>,
    );
  };
};

export default useOpenAutoinstallFileDetails;
