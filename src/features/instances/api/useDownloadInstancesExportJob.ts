import useFetch from "@/hooks/useFetch";
import {
  downloadBlob,
  supportsNativeSave,
  type SaveFilePickerHandle,
} from "@/utils/browserDownload";
import type { InstancesExportJob } from "../types/InstancesExportJob";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DEFAULT_EXPORT_FILENAME = "instances-export.tsv";

export const useDownloadInstancesExportJob = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<
    InstancesExportJob | null,
    Error,
    InstancesExportJob
  >({
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
          `computers/exports/${job.id}/download`,
          { responseType: "blob" },
        );
        const writable = await handle.createWritable();
        await writable.write(response.data);
        await writable.close();
        return job;
      }

      const response = await authFetch.get<Blob>(
        `computers/exports/${job.id}/download`,
        { responseType: "blob" },
      );
      downloadBlob(response.data, filename);
      return job;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["instances-export-jobs"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["instances-export-jobs-list"],
      });
    },
  });

  return {
    downloadInstancesExportJob: mutateAsync,
  };
};
