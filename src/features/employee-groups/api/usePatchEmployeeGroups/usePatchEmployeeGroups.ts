import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeGroup, PatchEmployeeGroupsParams } from "../../types";

const usePatchEmployeeGroups = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    AxiosResponse<EmployeeGroup[]>,
    AxiosError<ApiError>,
    PatchEmployeeGroupsParams
  >({
    mutationKey: ["employee_groups", "patch"],
    mutationFn: (params) => {
      const isSinglePatch = params.requests.length === 1;

      if (isSinglePatch) {
        const { id, ...rest } = params.requests[0];

        return authFetch.patch(`employee_groups/${id}`, rest);
      }

      return authFetch.post(`employee_groups/bulk/update`, params);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employee_groups"] }),
  });

  return {
    isPending,
    patchEmployeeGroups: mutate,
  };
};

export default usePatchEmployeeGroups;
