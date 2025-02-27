import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import type { ApiListResponse } from "@/types/ApiListResponse";

export const useEmployeeGroupsImport = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (stagedOidcGroupIds: number[]) =>
      authFetch.post<ApiListResponse<number[]>>("/employee_groups", {
        staged_oidc_group_ids: stagedOidcGroupIds,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] }),
  });

  return {
    createEmployeeGroup: mutateAsync,
    isEmployeeGroupCreating: isPending,
  };
};
