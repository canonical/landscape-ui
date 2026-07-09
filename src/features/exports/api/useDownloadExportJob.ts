import useFetch from "@/hooks/useFetch";
import {
  downloadBlob,
  supportsNativeSave,
  type SaveFilePickerHandle,
} from "@/utils/browserDownload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExportJob } from "../types/ExportJob";

const DEFAULT_EXPORT_FILENAME = "export.tsv";

export const useDownloadExportJob = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<ExportJob | null, Error, ExportJob>({
    mutationFn: async (job) => {
      const filename = job.filename || DEFAULT_EXPORT_FILENAME;

      if (supportsNativeSave(window)) {
        let handle: SaveFilePickerHandle;
        try {
          handle = await window.showSaveFilePicker({ suggestedName: filename });
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return null;
          }
          throw error;
        }

        const response = await authFetch.get<Blob>(
          `exports/${job.id}/download`,
          { responseType: "blob" },
        );
        const writable = await handle.createWritable();
        try {
          await writable.write(response.data);
        } finally {
          await writable.close();
        }
        return job;
      }

      const response = await authFetch.get<Blob>(`exports/${job.id}/download`, {
        responseType: "blob",
      });
      downloadBlob(response.data, filename);
      return job;
    },
    onSuccess: async (data) => {
      if (data) {
        await queryClient.invalidateQueries({ queryKey: ["all-export-jobs"] });
      }
    },
  });

  return { downloadExportJob: mutateAsync };
};
