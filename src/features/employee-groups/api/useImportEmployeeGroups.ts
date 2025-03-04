import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

interface PostEmployeeGroupsParams {
  readonly stagedOidcGroupIds: number[];
  readonly importAll: boolean;
}

export const useImportEmployeeGroups = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const { mutateAsync, isPending } = useMutation<
    ApiPaginatedResponse<number[]>,
    AxiosError<ApiError>,
    PostEmployeeGroupsParams
  >({
    mutationFn: ({ stagedOidcGroupIds, importAll }) =>
      authFetch.post("/employee_groups", {
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
