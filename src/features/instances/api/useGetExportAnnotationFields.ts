import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { InstanceListParams } from "../helpers";

export interface ExportAnnotationFieldOption {
  readonly id: string;
  readonly label: string;
  readonly annotation_key: string;
}

const buildAnnotationFieldParams = ({
  params,
}: {
  params: InstanceListParams;
}) => {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.set("query", params.query);
  }
  if (params.archived_only !== undefined) {
    searchParams.set("archived_only", String(params.archived_only));
  }
  if (params.wsl_children !== undefined) {
    searchParams.set("wsl_children", String(params.wsl_children));
  }
  if (params.wsl_parents !== undefined) {
    searchParams.set("wsl_parents", String(params.wsl_parents));
  }

  return searchParams;
};

interface ExportAnnotationFieldResponse {
  readonly results: ExportAnnotationFieldOption[];
}

export const useGetExportAnnotationFields = (params: InstanceListParams) => {
  const authFetch = useFetch();

  const { data: response, error, isError, isPending } = useQuery<
    AxiosResponse<ExportAnnotationFieldResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["instance-export-annotation-fields", params],
    queryFn: ({ signal }) =>
      authFetch.get<ExportAnnotationFieldResponse>(
        "computers/export/annotations",
        {
          params,
          paramsSerializer: () => buildAnnotationFieldParams({ params }).toString(),
          signal,
        },
      ),
  });

  return {
    exportAnnotationFields: response?.data.results ?? [],
    exportAnnotationFieldsError: error,
    isErrorExportAnnotationFields: isError,
    isGettingExportAnnotationFields: isPending,
  };
};
