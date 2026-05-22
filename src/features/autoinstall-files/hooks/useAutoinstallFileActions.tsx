import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { useUpdateAutoinstallFile } from "../api";
import type { AutoinstallFile } from "../types";
import useOpenAutoinstallFileDetails from "./useOpenAutoinstallFileDetails";

const useAutoinstallFileActions = (autoinstallFile: AutoinstallFile) => {
  const { notify } = useNotify();
  const { closeSidePanel, setPageParams } = usePageParams();

  const { updateAutoinstallFile } = useUpdateAutoinstallFile();

  const openAutoinstallFileDetails = useOpenAutoinstallFileDetails();

  return {
    openAutoinstallFileDetails: () => {
      openAutoinstallFileDetails(autoinstallFile);
    },

    openAutoinstallFileEditForm: () => {
      setPageParams({
        sidePath: ["edit-file"],
        name: String(autoinstallFile.id),
      });
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
  };
};

export default useAutoinstallFileActions;
