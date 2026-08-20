import LoadingState from "@/components/layout/LoadingState";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { lazy, Suspense } from "react";
import { useUpdateAutoinstallFile } from "../api";
import AutoinstallFileSidePanelTitle from "../components/AutoinstallFileSidePanelTitle";
import type { AutoinstallFile, AutoinstallFileTabId } from "../types";
import useOpenAutoinstallFileDetails from "./useOpenAutoinstallFileDetails";

const AutoinstallFileEditForm = lazy(
  async () =>
    import("@/features/autoinstall-files/components/AutoinstallFileEditForm"),
);

const useAutoinstallFileActions = (autoinstallFile: AutoinstallFile) => {
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();

  const { updateAutoinstallFile, isAutoinstallFileUpdating } =
    useUpdateAutoinstallFile();

  const openAutoinstallFileDetails = useOpenAutoinstallFileDetails();

  return {
    openAutoinstallFileDetails: (initialTabId?: AutoinstallFileTabId) => {
      openAutoinstallFileDetails(autoinstallFile, initialTabId);
    },

    openAutoinstallFileEditForm: () => {
      setSidePanelContent(
        <AutoinstallFileSidePanelTitle file={autoinstallFile} title="Edit" />,
        <Suspense fallback={<LoadingState />}>
          <AutoinstallFileEditForm autoinstallFile={autoinstallFile} />
        </Suspense>,
      );
    },

    setAutoinstallFileAsDefault: async () => {
      await updateAutoinstallFile({
        id: autoinstallFile.id,
        is_default: true,
      });

      closeSidePanel();

      notify.success({
        message:
          "Employee accounts without a specific autoinstall file assigned via the identity provider will now inherit this default file.",
        title: `You have successfully set ${autoinstallFile.filename} as the default autoinstall file`,
      });
    },

    isSettingAutoinstallFileAsDefault: isAutoinstallFileUpdating,
  };
};

export default useAutoinstallFileActions;
