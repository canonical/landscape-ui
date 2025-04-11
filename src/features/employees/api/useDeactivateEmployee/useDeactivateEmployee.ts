import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Employee } from "../../types";
import type { EmployeeActionParams } from "../../types/EmployeeParams";

interface DeactivateEmployeeParams extends EmployeeActionParams {
  sanitize_instances?: boolean;
  remove_instances?: boolean;
}

const useDeactivateEmployee = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Employee>,
    AxiosError<ApiError>,
    DeactivateEmployeeParams
  >({
    mutationKey: ["employee", "patch"],
    mutationFn: async ({ id, ...rest }) => {
      return authFetch.post(`employees/${id}/offboard`, rest);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employee"] }),
  });

  return {
    deactivateEmployee: mutateAsync,
    isDeactivating: isPending,
  };
};

export default useDeactivateEmployee;
