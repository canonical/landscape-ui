import { downloadInstancesCsv } from "../helpers";
import type { InstancesExportJob } from "../types/InstancesExportJob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import {
  EXPORT_JOBS_QUERY_KEY,
  getExportJobsFromResponse,
  setExportJobsResponseCache,
  type InstancesExportJobsResponse,
} from "./instancesExportJobsShared";
import type { AxiosResponse } from "axios";

const DEFAULT_EXPORT_FILENAME = "instances-export.tsv";

interface SaveFilePickerHandle {
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
}

interface SaveFilePickerWindow {
  showSaveFilePicker: (options?: {
    suggestedName?: string;
  }) => Promise<SaveFilePickerHandle>;
}

const supportsNativeSave = (
  candidate: typeof window,
): candidate is typeof window & SaveFilePickerWindow =>
  "showSaveFilePicker" in candidate;

export const useDownloadInstancesExportJob = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<
    InstancesExportJob,
    Error,
    InstancesExportJob
  >({
    mutationFn: async (job) => {
      const filename = job.filename || DEFAULT_EXPORT_FILENAME;

      const response = await authFetch.get<Blob>(
        `computers/exports/${job.id}/download`,
        { responseType: "blob" },
      );
      const blob = response.data;

      if (supportsNativeSave(window)) {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return job;
      }

      downloadInstancesCsv({ blob, filename });
      return job;
    },
    onSuccess: (_data, job) => {
      queryClient.setQueryData<
        AxiosResponse<InstancesExportJobsResponse> | undefined
      >(
        EXPORT_JOBS_QUERY_KEY,
        (current) =>
          setExportJobsResponseCache(
            current,
            getExportJobsFromResponse(current).filter(
              (item) => item.id !== job.id,
            ),
          ),
      );
      void queryClient.invalidateQueries({ queryKey: EXPORT_JOBS_QUERY_KEY });
    },
  });

  return {
    downloadInstancesExportJob: mutateAsync,
  };
};
