import LoadingState from "@/components/layout/LoadingState";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Suspense } from "react";
import { useUpdateAutoinstallFile } from "../api";
import AutoinstallFileEditForm from "../components/AutoinstallFileEditForm";
import AutoinstallFileSidePanelTitle from "../components/AutoinstallFileSidePanelTitle";
import type {
  AutoinstallFile,
  AutoinstallFileTabId,
  WithGroups,
} from "../types";
import useOpenAutoinstallFileDetails from "./useOpenAutoinstallFileDetails";

const useAutoinstallFileActions = (
  autoinstallFile: WithGroups<AutoinstallFile>,
) => {
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { updateAutoinstallFile } = useUpdateAutoinstallFile();

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
        contents: autoinstallFile.contents,
      });

      notify.success({
        message:
          "Employee groups without an autoinstall file assigned will inherit this default file.",
        title: `You have successfully set ${autoinstallFile.filename} as the default autoinstall file`,
      });
    },
  };
};

export default useAutoinstallFileActions;
