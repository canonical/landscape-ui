import usePageParams from "@/hooks/usePageParams";
import type { AutoinstallFile } from "../types";

const useOpenAutoinstallFileDetails = () => {
  const { setPageParams } = usePageParams();

  return (autoinstallFile: AutoinstallFile): void => {
    setPageParams({
      sidePath: ["view-file"],
      name: String(autoinstallFile.id),
    });
  };
};

export default useOpenAutoinstallFileDetails;
