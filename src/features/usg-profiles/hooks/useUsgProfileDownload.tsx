import useDebug from "@/hooks/useDebug";
import { useGetUsgProfileAuditDownload } from "../api";

type USGProfileDownloadMode = "audit" | "tailoring";

const getFilenameFromPath = (path: string) => {
  const cleanPath = path.split(/[?#]/)[0] ?? "";
  const filename = cleanPath.slice(cleanPath.lastIndexOf("/") + 1);
  return filename || null;
};

const getFilenameFromContentDisposition = (contentDisposition?: string) => {
  if (!contentDisposition) {
    return null;
  }

  const filenameStarMatch = contentDisposition.match(/filename\*=([^;]+)/i);
  if (filenameStarMatch?.[1]) {
    const value = filenameStarMatch[1].trim();
    const encodedValue = value.includes("''")
      ? (value.split("''")[1] ?? value)
      : value;
    return decodeURIComponent(encodedValue).replace(/^"|"$/g, "");
  }

  const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (filenameMatch?.[1]) {
    return filenameMatch[1];
  }

  return null;
};

const decodeBase64ToBlob = (value: string, mimeType: string) => {
  try {
    const cleaned = value.replace(/\s+/g, "");
    if (!cleaned) {
      return null;
    }

    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type: mimeType });
  } catch {
    return null;
  }
};

const withExtension = (
  filename: string,
  mimeType: string,
  mode: USGProfileDownloadMode,
) => {
  if (/\.[^./]+$/.test(filename)) {
    return filename;
  }

  if (mode === "tailoring") {
    return `${filename}.xml`;
  }

  if (mimeType.includes("csv")) {
    return `${filename}.csv`;
  }

  return filename;
};

export const useUsgProfileDownload = (mode: USGProfileDownloadMode) => {
  const debug = useDebug();
  const { getUsgProfileAuditDownload } = useGetUsgProfileAuditDownload();

  return async (path: string | null, filename?: string) => {
    if (!path) {
      debug(new Error("Could not download file because no path was provided."));
      return;
    }

    try {
      const { data, headers } = await getUsgProfileAuditDownload({
        path,
      });

      if (data.type.includes("text/html")) {
        throw new Error(
          "Received HTML instead of the expected downloadable file.",
        );
      }

      const decodedBlob = decodeBase64ToBlob(
        await data.text(),
        mode === "tailoring" ? "application/xml" : "text/csv;charset=utf-8",
      );

      const fileToDownload = decodedBlob ?? data;

      const url = URL.createObjectURL(fileToDownload);
      const link = document.createElement("a");

      link.href = url;

      const headerFilename = getFilenameFromContentDisposition(
        headers["content-disposition"],
      );
      const pathFilename = getFilenameFromPath(path);
      const resolvedFilename =
        filename ??
        headerFilename ??
        pathFilename ??
        (mode === "tailoring" ? "tailoring-file" : "download");

      link.download = withExtension(
        resolvedFilename,
        fileToDownload.type,
        mode,
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      debug(error);
    }
  };
};
