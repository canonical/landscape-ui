import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PatchEmployeeParams, Employee } from "../../types";
import useInstances from "@/hooks/useInstances";

interface DeactivateEmployeeParams extends PatchEmployeeParams {
  sanitize?: boolean;
  removeFromLandscape?: boolean;
}

const useDeactivateEmployee = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const { removeInstancesQuery, sanitizeInstanceQuery } = useInstances();
  const { mutateAsync: removeInstances } = removeInstancesQuery;
  const { mutateAsync: sanitizeInstance } = sanitizeInstanceQuery;

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Employee>,
    AxiosError<ApiError>,
    DeactivateEmployeeParams
  >({
    mutationKey: ["employee", "patch"],
    mutationFn: async (params) => {
      if (params.sanitize) {
        await sanitizeInstance({ computer_id: params.id });
      }

      if (params.removeFromLandscape) {
        await removeInstances({ computer_ids: [params.id] });
      }

      return authFetch.patch(`employees/${params.id}`, params);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employee"] }),
  });

  return {
    deactivateEmployee: mutateAsync,
    isPending,
  };
};

export default useDeactivateEmployee;
