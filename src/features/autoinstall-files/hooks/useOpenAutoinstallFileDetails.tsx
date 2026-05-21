import usePageParams from "@/hooks/usePageParams";
import type { AutoinstallFile, AutoinstallFileTabId } from "../types";

const useOpenAutoinstallFileDetails = () => {
  const { setPageParams, sidePath } = usePageParams();

  return (
    autoinstallFile: AutoinstallFile,
    initialTabId?: AutoinstallFileTabId,
  ): void => {
    setPageParams({
      sidePath: [...sidePath, "view-file"],
      name: String(autoinstallFile.id),
      ...(initialTabId ? { tab: initialTabId } : {}),
    });
  };
};

export default useOpenAutoinstallFileDetails;
