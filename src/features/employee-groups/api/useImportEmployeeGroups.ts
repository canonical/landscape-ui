import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

export interface ImportEmployeeGroupsParams {
  readonly stagedOidcGroupIds: number[];
  readonly importAll: boolean;
}

export interface ImportEmployeeGroupsCallParams {
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
    mutationFn: ({ stagedOidcGroupIds, importAll }) =>
      authFetch.post<
        unknown,
        AxiosResponse<ApiPaginatedResponse<number>>,
        ImportEmployeeGroupsCallParams
      >("/employee_groups", {
        staged_oidc_group_ids: stagedOidcGroupIds,
        import_all: importAll,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] }),
  });

  return {
    importEmployeeGroups: mutateAsync,
    isEmployeeGroupsImporting: isPending,
  };
};
