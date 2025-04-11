import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { DeleteEmployeeGroupsParams } from "../types";

export const useDeleteEmployeeGroups = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    DeleteEmployeeGroupsParams
  >({
    mutationKey: ["employee_groups", "delete"],
    mutationFn: (params) => {
      const isSingleDelete = params.ids.length === 1;

      if (isSingleDelete) {
        return authFetch.delete(`employee_groups/${params.ids[0]}`);
      }

      return authFetch.post("employee_groups/bulk/delete", { ids: params.ids });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employee_groups"] }),
  });

  return {
    deleteEmployeeGroups: mutateAsync,
    isDeletingEmployeeGroups: isPending,
  };
};
