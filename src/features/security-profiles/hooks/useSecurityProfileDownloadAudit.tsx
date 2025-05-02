import { useGetSecurityProfileAuditDownload } from "../api";

export const useSecurityProfileDownloadAudit = () => {
  const { getSecurityProfileAuditDownload } =
    useGetSecurityProfileAuditDownload();

  return async (path: string | null) => {
    if (!path) {
      throw new Error();
    }

    const { data } = await getSecurityProfileAuditDownload({
      path,
    });

    const blob = new Blob([data], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = path.slice(path.lastIndexOf("/") + 1);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };
};
