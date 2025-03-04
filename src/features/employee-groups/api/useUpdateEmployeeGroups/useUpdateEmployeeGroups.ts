import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeGroup } from "../../types";

const useUpdateEmployeeGroups = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<EmployeeGroup[]>,
    AxiosError<ApiError>,
    Pick<EmployeeGroup, "id" | "priority" | "autoinstall_file">[]
  >({
    mutationKey: ["employee_groups", "update"],
    mutationFn: (groups) => {
      const isSinglePatch = groups.length === 1;

      if (isSinglePatch) {
        const { id, ...rest } = groups[0];

        return authFetch.patch(`employee_groups/${id}`, rest);
      }

      return authFetch.post(`employee_groups/bulk/update`, {
        requests: groups,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employee_groups"] }),
  });

  return {
    isUpdatingEmployeeGroups: isPending,
    updateEmployeeGroups: mutateAsync,
  };
};

export default useUpdateEmployeeGroups;
