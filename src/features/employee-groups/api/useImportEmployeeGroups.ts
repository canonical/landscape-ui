import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

export interface ImportEmployeeGroupsParams {
  readonly staged_oidc_group_ids: number[];
  readonly import_all: boolean;
}

export const useImportEmployeeGroups = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<ApiPaginatedResponse<number>>,
    AxiosError<ApiError>,
    ImportEmployeeGroupsParams
  >({
    mutationFn: ({ staged_oidc_group_ids, import_all }) =>
      authFetch.post("/employee_groups", {
        staged_oidc_group_ids,
        import_all,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] }),
  });

  return {
    importEmployeeGroups: mutateAsync,
    isEmployeeGroupsImporting: isPending,
  };
};
