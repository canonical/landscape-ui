import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeGroup } from "../types";

export const useUpdateEmployeeGroups = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<EmployeeGroup[]>,
    AxiosError<ApiError>,
    Pick<EmployeeGroup, "id" | "priority" | "autoinstall_file">[]
  >({
    mutationKey: ["employee_groups", "update"],
    mutationFn: async (groups) => {
      const isSinglePatch = groups.length === 1;

      if (isSinglePatch) {
        const [{ id, autoinstall_file, priority }] = groups;

        return authFetch.patch(`employee_groups/${id}`, {
          autoinstall_file_id: autoinstall_file?.id,
          priority,
        });
      }

      const paramBody = groups.map((group) => {
        return {
          id: group.id,
          autoinstall_file_id: group.autoinstall_file?.id,
          priority: group.priority,
        };
      });

      return authFetch.post(`employee_groups/bulk/update`, {
        requests: paramBody,
      });
    },
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["employee_groups"] }),
  });

  return {
    isUpdatingEmployeeGroups: isPending,
    updateEmployeeGroups: mutateAsync,
  };
};
