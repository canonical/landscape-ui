import { downloadBlob } from "@/utils/browserDownload";
import { useGetUsgProfileAuditDownload } from "../api/useGetUsgProfileAuditDownload";

export const useUsgProfileDownloadAudit = () => {
  const { getUsgProfileAuditDownload, isUsgProfileAuditDownloadLoading } =
    useGetUsgProfileAuditDownload();

  return {
    downloadAudit: async (path: string | null) => {
      if (!path) {
        throw new Error();
      }

      const { data } = await getUsgProfileAuditDownload({
        path,
      });

      const blob = new Blob([data], {
        type: "text/csv;charset=utf-8;",
      });

      downloadBlob(blob, path.slice(path.lastIndexOf("/") + 1));
    },

    isDownloadingAudit: isUsgProfileAuditDownloadLoading,
  };
};
